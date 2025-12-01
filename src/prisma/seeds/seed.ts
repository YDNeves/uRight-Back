import {
  PrismaClient,
  Role,
  MemberStatus,
  PaymentStatus,
  AssociationStatus,
  AssociationType,
  CategoryType,
  TransactionType,
  ReportType,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log(' Iniciando seed da base de dados AssoGest...')

  //  Criar utilizadores
  const passwordHash = await bcrypt.hash('123456', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@assogest.com' },
    update: {},
    create: {
      name: 'Administrador Geral',
      email: 'admin@assogest.com',
      password: passwordHash,
      role: Role.SUPERADMIN,
      // Adicionado imageUrl para o Administrador
      imageUrl: 'https://placehold.co/150x150/1e293b/FFFFFF?text=ADMIN',
    },
  })

  const tesoureiro = await prisma.user.upsert({
    where: { email: 'tesoureiro@assogest.com' },
    update: {},
    create: {
      name: 'João Tesoureiro',
      email: 'tesoureiro@assogest.com',
      password: passwordHash,
      role: Role.TREASURER,
      // Adicionado imageUrl para o Tesoureiro
      imageUrl: 'https://placehold.co/150x150/065f46/FFFFFF?text=TES',
    },
  })

  const secretario = await prisma.user.upsert({
    where: { email: 'secretario@assogest.com' },
    update: {},
    create: {
      name: 'Maria Secretária',
      email: 'secretario@assogest.com',
      password: passwordHash,
      role: Role.SECRETARY,
      // Adicionado imageUrl para a Secretária
      imageUrl: 'https://placehold.co/150x150/9333ea/FFFFFF?text=SEC',
    },
  })

  const membro = await prisma.user.upsert({
    where: { email: 'membro@assogest.com' },
    update: {},
    create: {
      name: 'Carlos Membro',
      email: 'membro@assogest.com',
      password: passwordHash,
      role: Role.MEMBER,
      // Adicionado imageUrl para o Membro
      imageUrl: 'https://placehold.co/150x150/ca8a04/FFFFFF?text=MEM',
    },
  })

  console.log(' Utilizadores criados com sucesso.')

  // Criar associações
  const assoc1 = await prisma.association.create({
    data: {
      name: 'Associação dos Engenheiros de Angola',
      province: 'Luanda',
      status: AssociationStatus.ACTIVE,
      type: AssociationType.ASSOCIAÇÃO,
      // Adicionado imageUrl para a Associação 1
      imageUrl: 'https://placehold.co/300x200/52525B/FFFFFF?text=A.E.A',
    },
  })

  const assoc2 = await prisma.association.create({
    data: {
      name: 'Cooperativa dos Técnicos de Informática',
      province: 'Benguela',
      status: AssociationStatus.PENDING,
      type: AssociationType.COOPERATIVA,
      // Adicionado imageUrl para a Associação 2
      imageUrl: 'https://placehold.co/300x200/155e75/FFFFFF?text=C.T.I',
    },
  })

  console.log(' Associações criadas.')

  // Criar membros
  const member1 = await prisma.member.create({
    data: {
      userId: membro.id,
      associationId: assoc1.id,
      nif: '005678912LA04',
      bi: '004567123LA040',
      profession: 'Engenheiro Informático',
      status: MemberStatus.ACTIVE,
    },
  })

  const member2 = await prisma.member.create({
    data: {
      userId: tesoureiro.id,
      associationId: assoc1.id,
      nif: '009876543LA09',
      bi: '009876543LA09',
      profession: 'Contabilista',
      status: MemberStatus.ACTIVE,
    },
  })

  console.log(' Membros adicionados.')

  // Criar categorias financeiras
  const receitaCat = await prisma.financeCategory.create({
    data: {
      name: 'Quotas Mensais',
      type: CategoryType.REVENUE,
      description: 'Contribuições regulares dos associados.',
    },
  })

  const despesaCat = await prisma.financeCategory.create({
    data: {
      name: 'Despesas Operacionais',
      type: CategoryType.EXPENSE,
      description: 'Gastos administrativos e de eventos.',
    },
  })

  console.log(' Categorias financeiras criadas.')

  // Criar transações financeiras
  await prisma.financeTransaction.createMany({
    data: [
      {
        categoryId: receitaCat.id,
        associationId: assoc1.id,
        amount: 45000,
        type: TransactionType.INCOME,
        method: 'Transferência Bancária',
        description: 'Receita das quotas de Outubro',
      },
      {
        categoryId: despesaCat.id,
        associationId: assoc1.id,
        amount: 12000,
        type: TransactionType.EXPENSE,
        method: 'Dinheiro',
        description: 'Compra de material de escritório',
      },
    ],
  })

  console.log(' Transações financeiras inseridas.')

  // Criar pagamentos
  await prisma.payment.createMany({
    data: [
      {
        memberId: member1.id,
        amount: 5000,
        method: 'Multicaixa Express',
        status: PaymentStatus.PAID,
        associationId: assoc1.id,
      },
      {
        memberId: member2.id,
        amount: 7500,
        method: 'Transferência Bancária',
        status: PaymentStatus.PENDING,
        associationId: assoc1.id,
      },
    ],
  })

  console.log(' Pagamentos inseridos.')

  // Criar relatórios
  await prisma.report.create({
    data: {
      title: 'Relatório Financeiro - Outubro',
      type: ReportType.ASSOCIATION,
      associationId: assoc1.id,
      generatedById: admin.id,
      data: {
        receitas: 45000,
        despesas: 12000,
        saldo: 33000,
      },
    },
  })

  console.log(' Relatório criado.')

  // Criar notificações
  await prisma.notification.createMany({
    data: [
      {
        type: 'INFO',
        recipient: membro.email,
        subject: 'Pagamento Recebido',
        message: 'O seu pagamento foi confirmado com sucesso.',
        status: 'ENVIADO',
      },
      {
        type: 'ALERTA',
        recipient: tesoureiro.email,
        subject: 'Novo Relatório Disponível',
        message: 'O relatório financeiro de Outubro foi gerado.',
        status: 'ENVIADO',
      },
    ],
  })

  console.log(' Notificações criadas.')
  console.log(' Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(' Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
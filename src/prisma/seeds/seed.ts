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
  
   // ------------------------------------
   // 1. CRIAR UTILIZADORES (USUÁRIOS)
   // ------------------------------------
   const passwordHash = await bcrypt.hash('123456', 10)
  
   const admin = await prisma.user.upsert({
    where: { email: 'admin@assogest.com' },
    update: {},
    create: {
     name: 'Administrador Geral',
     email: 'admin@assogest.com',
     password: passwordHash,
     role: Role.SUPERADMIN,
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
    },
   })
  
   console.log(' Utilizadores criados com sucesso.')
  
   // ------------------------------------
   // 2. CRIAR ASSOCIAÇÕES
   // ------------------------------------
 
   const assoc1 = await prisma.association.create({
    data: {
     name: 'Associação dos Engenheiros de Angola',
     province: 'Luanda',
     status: AssociationStatus.ACTIVE,
     type: AssociationType.ASSOCIAÇÃO,
     imageUrl: 'https://placehold.co/300x200/52525B/FFFFFF?text=A.E.A',
    },
   })
  
   const assoc2 = await prisma.association.create({
    data: {
     name: 'Cooperativa dos Técnicos de Informática',
     province: 'Benguela',
     status: AssociationStatus.PENDING,
     type: AssociationType.COOPERATIVA,
     imageUrl: 'https://placehold.co/300x200/155e75/FFFFFF?text=C.T.I',
    },
   })
  
   console.log(' Associações criadas.')
  
   // ------------------------------------
   // 3. CRIAR MEMBROS
   // ------------------------------------
   // ADICIONADO: o campo imageUrl é adicionado ao modelo Member.
   const member1 = await prisma.member.create({
    data: {
     userId: membro.id,
     associationId: assoc1.id,
     nif: '005678912LA04',
     bi: '004567123LA040',
     profession: 'Engenheiro Informático',
     status: MemberStatus.ACTIVE,
     imageUrl: 'https://placehold.co/150x150/ca8a04/FFFFFF?text=MEM', // Foto do Membro
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
     imageUrl: 'https://placehold.co/150x150/065f46/FFFFFF?text=TES', // Foto do Tesoureiro
    },
   })
  
   // Nota: O Admin e o Secretário não são membros desta associação no seed.
  
   console.log(' Membros adicionados.')
    
   // ------------------------------------
   // 4. OUTROS REGISTROS (Financeiros, Pagamentos, Relatórios, Notificações)
   // ------------------------------------
    
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
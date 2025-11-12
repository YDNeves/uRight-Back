import { PrismaClient, Role, MemberStatus, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log(' Iniciando seed da base de dados AssoGest...')

  // Criar utilizadores
  const passwordHash = await bcrypt.hash('123456', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@assogest.com' },
    update: {},
    create: {
      name: 'Administrador Geral',
      email: 'admin@assogest.com',
      password: passwordHash,
      role: Role.ADMIN,
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

  // 2️⃣ Criar associações
  const assoc1 = await prisma.association.create({
    data: {
      name: 'Associação dos Engenheiros de Angola',
      province: 'Luanda',
    },
  })

  const assoc2 = await prisma.association.create({
    data: {
      name: 'Cooperativa dos Técnicos de Informática',
      province: 'Benguela',
    },
  })

  console.log(' Associações criadas.')

  // 3️⃣ Criar membros
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

  // 4️⃣ Criar pagamentos
  await prisma.payment.createMany({
    data: [
      {
        memberId: member1.id,
        amount: 5000,
        method: 'Multicaixa Express',
        status: PaymentStatus.PAID,
      },
      {
        memberId: member2.id,
        amount: 7500,
        method: 'Transferência Bancária',
        status: PaymentStatus.PENDING,
      },
    ],
  })

  console.log(' Pagamentos inseridos.')
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

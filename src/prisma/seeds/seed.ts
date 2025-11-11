import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.user.deleteMany();

async function main() {

 console.log("Dados antigos limpos. Começando a criação...");
  const luanda = await prisma.city.create({
    data: {
      name: "Luanda",
      description: "Capital vibrante de Angola, com belas praias e vida urbana intensa.",
      imageUrl: "https://images.unsplash.com/photo-1604937455095-efcbff7d5c10",
    },
  });

  const benguela = await prisma.city.create({
    data: {
      name: "Benguela",
      description: "Conhecida pelas praias extensas e pôr-do-sol incrível.",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
  });

  const lubango = await prisma.city.create({
    data: {
      name: "Lubango",
      description: "Famosa pela Serra da Leba e paisagens naturais deslumbrantes.",
      imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    },
  });

  const huambo = await prisma.city.create({
    data: {
      name: "Huambo",
      description: "Cidade histórica e cultural no planalto central.",
      imageUrl: "https://images.unsplash.com/photo-1503264116251-35a269479413",
    },
  });

  const namibe = await prisma.city.create({
    data: {
      name: "Namibe",
      description: "Cidade costeira famosa pelo deserto e litoral selvagem.",
      imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    },
  });

  // Hotéis
  // Criando hotéis individualmente para obter os IDs para os quartos
  const hotelPresidente = await prisma.hotel.create({
    data: {
      name: "Hotel Presidente Luanda",
      description: "Um dos hotéis mais luxuosos de Luanda, com vista para a baía.",
      cityId: luanda.id,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      location: "Luanda, Marginal",
      price: 1221,
    },
  });

  const epicSana = await prisma.hotel.create({
    data: {
      name: "EPIC SANA Luanda",
      description: "Hotel 5 estrelas com restaurantes, spa e excelente localização.",
      cityId: luanda.id,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
      location: "Luanda, Ingombota",
      price: 1480,
    },
  });

  const hotelPraiaMorena = await prisma.hotel.create({
    data: {
      name: "Hotel Praia Morena",
      description: "Hotel aconchegante à beira-mar em Benguela.",
      cityId: benguela.id,
      image: "https://images.unsplash.com/photo-1551776235-dde6d4829808",
      location: "Benguela, Praia Morena",
      price: 870,
    },
  });

  const hotelTerminus = await prisma.hotel.create({
    data: {
      name: "Hotel Terminus",
      description: "Hotel moderno no centro de Benguela.",
      cityId: benguela.id,
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      location: "Benguela, Centro",
      price: 690,
    },
  });

  const pululukwa = await prisma.hotel.create({
    data: {
      name: "Pululukwa Resort",
      description: "Resort de luxo em meio à natureza de Lubango.",
      cityId: lubango.id,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      location: "Lubango, Serra da Leba",
      price: 950,
    },
  });

  const hotelSerraChela = await prisma.hotel.create({
    data: {
      name: "Hotel Serra da Chela",
      description: "Hospedagem confortável com vista para as montanhas.",
      cityId: lubango.id,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      location: "Lubango",
      price: 720,
    },
  });

  const ekuikuiHotel = await prisma.hotel.create({
    data: {
      name: "Ekuikui Hotel",
      description: "Hotel moderno no coração de Huambo.",
      cityId: huambo.id,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      location: "Huambo, Centro",
      price: 640,
    },
  });

  const hotelRitz = await prisma.hotel.create({
    data: {
      name: "Hotel Ritz Huambo",
      description: "Opção elegante com serviços premium.",
      cityId: huambo.id,
      image: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2101f",
      location: "Huambo",
      price: 780,
    },
  });

  const infotourHotel = await prisma.hotel.create({
    data: {
      name: "Infotour Hotel Namibe",
      description: "Hotel confortável próximo ao deserto do Namibe.",
      cityId: namibe.id,
      image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      location: "Namibe, Centro",
      price: 590,
    },
  });

  const chongoroiLodge = await prisma.hotel.create({
    data: {
      name: "Chongoroi Lodge",
      description: "Alojamento turístico em meio ao deserto e litoral.",
      cityId: namibe.id,
      image: "https://images.unsplash.com/photo-1551776235-dde6d4829808",
      location: "Namibe",
      price: 670,
    },
  });

  // Usuários
  const joao = await prisma.user.create({
    data: {
      name: "João da Silva",
      email: "joao@example.com",
      password: "$2b$10$zz5WSAHNvPyYKVX.7c.1U.8bWmpH1KZWTpg5CRyKVvgT0JPqZ0tA6",
    },
  });

  await prisma.user.create({
    data: {
      name: "Jo da Silva",
      role: "ADMIN",
      email: "jo@example.com",
      password: "$2b$10$zz5WSAHNvPyYKVX.7c.1U.8bWmpH1KZWTpg5CRyKVvgT0JPqZ0tA6",
    },
  });

  // Quartos
  await prisma.room.createMany({
    data: [
      // Quartos para o Hotel Presidente Luanda
      {
        name: "Quarto Standard",
        price: 1221,
        capacity: 2,
        amenities: ["Ar-condicionado", "Wi-Fi"],
        image: "https://images.unsplash.com/photo-1598464731835-f716606368d4?q=80&w=1471&auto=format&fit=crop",
        hotelId: hotelPresidente.id,
      },
      {
        name: "Suíte Júnior",
        price: 1500,
        capacity: 2,
        amenities: ["Ar-condicionado", "Varanda", "Mini-bar"],
        image: "https://images.unsplash.com/photo-1629140939598-a15d6543d8f8?q=80&w=1528&auto=format&fit=crop",
        hotelId: hotelPresidente.id,
      },

      // Quartos para o EPIC SANA Luanda
      {
        name: "Quarto Deluxe",
        price: 1480,
        capacity: 2,
        amenities: ["Ar-condicionado", "Wi-Fi", "Vista para a cidade"],
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        hotelId: epicSana.id,
      },
      {
        name: "Suíte Master",
        price: 2500,
        capacity: 4,
        amenities: ["Ar-condicionado", "Varanda", "Banheira", "Vista para o mar"],
        image: "https://images.unsplash.com/photo-1631049381678-b1ae67530659?q=80&w=1470&auto=format&fit=crop",
        hotelId: epicSana.id,
      },

      // Quartos para o Hotel Praia Morena
      {
        name: "Quarto com Vista para o Mar",
        price: 900,
        capacity: 2,
        amenities: ["Ar-condicionado", "Wi-Fi", "Varanda"],
        image: "https://images.unsplash.com/photo-1625244724912-1f557a90646b?q=80&w=1528&auto=format&fit=crop",
        hotelId: hotelPraiaMorena.id,
      },

      // Quartos para o Hotel Terminus
      {
        name: "Quarto Familiar",
        price: 1300,
        capacity: 4,
        amenities: ["Ar-condicionado", "Wi-Fi", "Mini-bar"],
        image: "https://images.unsplash.com/photo-1598464731835-f716606368d4?q=80&w=1471&auto=format&fit=crop",
        hotelId: hotelTerminus.id,
      },

      // Quartos para o Pululukwa Resort
      {
        name: "Chalé na Floresta",
        price: 1500,
        capacity: 2,
        amenities: ["Lareira", "Varanda", "Cozinha"],
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1418&auto=format&fit=crop",
        hotelId: pululukwa.id,
      },

      // Quartos para o Hotel Serra da Chela
      {
        name: "Suíte Panorâmica",
        price: 900,
        capacity: 2,
        amenities: ["Ar-condicionado", "Vista para a montanha"],
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f90?q=80&w=1470&auto=format&fit=crop",
        hotelId: hotelSerraChela.id,
      },

      // Quartos para o Ekuikui Hotel
      {
        name: "Quarto Econômico",
        price: 550,
        capacity: 1,
        amenities: ["Ar-condicionado", "Wi-Fi"],
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        hotelId: ekuikuiHotel.id,
      },

      // Quartos para o Hotel Ritz Huambo
      {
        name: "Quarto Executivo",
        price: 850,
        capacity: 2,
        amenities: ["Ar-condicionado", "Wi-Fi", "Cafeteira"],
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        hotelId: hotelRitz.id,
      },

      // Quartos para o Infotour Hotel Namibe
      {
        name: "Quarto Standard",
        price: 590,
        capacity: 2,
        amenities: ["Ar-condicionado", "Wi-Fi"],
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        hotelId: infotourHotel.id,
      },

      // Quartos para o Chongoroi Lodge
      {
        name: "Bangalô",
        price: 700,
        capacity: 2,
        amenities: ["Ar-condicionado", "Vista para o deserto"],
        image: "https://images.unsplash.com/photo-1551776235-dde6d4829808",
        hotelId: chongoroiLodge.id,
      },
    ],
  });

  // O bloco de quarto e reserva simples agora pode ser mais dinâmico
  const room = await prisma.room.create({
    data: {
      name: "Suíte Master",
      price: 250,
      originalPrice: 300,
      capacity: 2,
      amenities: ["Ar-condicionado", "Varanda", "Banheira"],
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      hotelId: epicSana.id,
    },
  });

  // Criar reserva
  await prisma.booking.create({
    data: {
      checkIn: new Date("2025-09-01"),
      checkOut: new Date("2025-09-05"),
      guests: 2,
      totalPrice: 1000,
      status: "CONFIRMED",
      userId: joao.id,
      hotelId: epicSana.id,
      roomId: room.id,
    },
  });
}

main()
  .then(async () => {
    console.log("Seed data inserted successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
export interface Persona {
  name: string
  email: string
  password: string
  role: 'apprentice' | 'instructor' | 'junior_staff' | 'senior_instructor' | 'admin'
  type: 'moderator' | 'assistant' | 'commentator' | 'visitor' | 'newMember'
}

function p(name: string, role: Persona['role'], type: Persona['type'], idx: number): Persona {
  const slug = name.toLowerCase().replace(/\s+/g, '.')
  return {
    name,
    email: `${slug}.hermes${idx}@loseyourip.hermes`,
    password: `Hermes#${idx}_pass`,
    role,
    type,
  }
}

const moderators: Persona[] = [
  p('Ada Obi', 'admin', 'moderator', 1),
  p('Kwame Asante', 'admin', 'moderator', 2),
  p('Zara Okafor', 'admin', 'moderator', 3),
]

const assistants: Persona[] = [
  p('Chidi Eze', 'instructor', 'assistant', 10),
  p('Amina Diallo', 'senior_instructor', 'assistant', 11),
  p('Tunde Balogun', 'instructor', 'assistant', 12),
  p('Nkechi Okoro', 'instructor', 'assistant', 13),
  p('Sipho Mbeki', 'instructor', 'assistant', 14),
  p('Fatima Hassan', 'senior_instructor', 'assistant', 15),
  p('Kofi Mensah', 'instructor', 'assistant', 16),
  p('Yaa Asantewaa', 'instructor', 'assistant', 17),
  p('Jelani Nkosi', 'instructor', 'assistant', 18),
  p('Amara Eze', 'instructor', 'assistant', 19),
]

const commentators: Persona[] = [
  p('Babatunde Lawal', 'instructor', 'commentator', 20),
  p('Chioma Nwosu', 'instructor', 'commentator', 21),
  p('Dumisani Khumalo', 'apprentice', 'commentator', 22),
  p('Esi Akyea', 'instructor', 'commentator', 23),
  p('Foluke Adeyemi', 'instructor', 'commentator', 24),
  p('Ghana Kofi', 'instructor', 'commentator', 25),
  p('Hauwa Mohammed', 'apprentice', 'commentator', 26),
  p('Ifeanyi Okafor', 'instructor', 'commentator', 27),
  p('Jomo Kenyatta', 'instructor', 'commentator', 28),
  p('Kadija Sesay', 'apprentice', 'commentator', 29),
  p('Lekan Soyinka', 'instructor', 'commentator', 30),
  p('Makeda Haile', 'instructor', 'commentator', 31),
  p('Ngozi Adichie', 'apprentice', 'commentator', 32),
  p('Oluwaseun Adebayo', 'instructor', 'commentator', 33),
  p('Precious Moyo', 'instructor', 'commentator', 34),
  p('Rashid Khamisi', 'instructor', 'commentator', 35),
  p('Sade Ogunyemi', 'apprentice', 'commentator', 36),
  p('Thabo Mokoena', 'instructor', 'commentator', 37),
  p('Uche Obi', 'instructor', 'commentator', 38),
  p('Wanjiku Kimani', 'instructor', 'commentator', 39),
]

const visitors: Persona[] = [
  p('Abayomi Ojo', 'apprentice', 'visitor', 40),
  p('Binta Camara', 'apprentice', 'visitor', 41),
  p('Chika Okeke', 'apprentice', 'visitor', 42),
  p('Diarra Traore', 'apprentice', 'visitor', 43),
  p('Ekene Nwankwo', 'apprentice', 'visitor', 44),
  p('Farida Bello', 'apprentice', 'visitor', 45),
  p('Goma Luhaka', 'apprentice', 'visitor', 46),
  p('Habib Sall', 'apprentice', 'visitor', 47),
  p('Idris Fagbemi', 'apprentice', 'visitor', 48),
  p('Jendayi Mabaso', 'apprentice', 'visitor', 49),
  p('Kesi Osei', 'apprentice', 'visitor', 50),
  p('Lungile Dlamini', 'apprentice', 'visitor', 51),
  p('Mensah Bonsu', 'apprentice', 'visitor', 52),
  p('Naledi Mogale', 'apprentice', 'visitor', 53),
  p('Ogochukwu Eze', 'apprentice', 'visitor', 54),
  p('Palesa Mohlala', 'apprentice', 'visitor', 55),
  p('Qudus Akinlade', 'apprentice', 'visitor', 56),
  p('Ramatoulie Jallow', 'apprentice', 'visitor', 57),
  p('Sekou Toure', 'apprentice', 'visitor', 58),
  p('Tendai Gumbo', 'apprentice', 'visitor', 59),
  p('Umaru Sillah', 'apprentice', 'visitor', 60),
  p('Vuyo Zondi', 'apprentice', 'visitor', 61),
  p('Wambui Gichinga', 'apprentice', 'visitor', 62),
  p('Xola Ndlovu', 'apprentice', 'visitor', 63),
  p('Yewande Adekunle', 'apprentice', 'visitor', 64),
  p('Zanele Mthembu', 'apprentice', 'visitor', 65),
  p('Akintunde Balogun', 'apprentice', 'visitor', 66),
  p('Bosede Ajayi', 'apprentice', 'visitor', 67),
  p('Chanda Banda', 'apprentice', 'visitor', 68),
  p('Desta Negassi', 'apprentice', 'visitor', 69),
]

const newMembers: Persona[] = [
  p('Efemena Uduak', 'apprentice', 'newMember', 70),
  p('Femi Ogunbiyi', 'apprentice', 'newMember', 71),
  p('Gifty Nkrumah', 'apprentice', 'newMember', 72),
  p('Henry Udeze', 'apprentice', 'newMember', 73),
  p('Imani Zuma', 'apprentice', 'newMember', 74),
  p('Joana Quansah', 'apprentice', 'newMember', 75),
  p('Kelechi Azikiwe', 'apprentice', 'newMember', 76),
  p('Lamin Bah', 'apprentice', 'newMember', 77),
  p('Mariam Diallo', 'apprentice', 'newMember', 78),
  p('Nnaemeka Okonkwo', 'apprentice', 'newMember', 79),
  p('Olabisi Oni', 'apprentice', 'newMember', 80),
  p('Phumzile Nkosi', 'apprentice', 'newMember', 81),
  p('Remilekun Akin', 'apprentice', 'newMember', 82),
  p('Sierra Bangura', 'apprentice', 'newMember', 83),
  p('Takunda Moyo', 'apprentice', 'newMember', 84),
  p('Uloma Nwachukwu', 'apprentice', 'newMember', 85),
  p('Victoria Amadi', 'apprentice', 'newMember', 86),
  p('Wale Ogunlade', 'apprentice', 'newMember', 87),
  p('Xavier Okyere', 'apprentice', 'newMember', 88),
  p('Yetunde Bakare', 'apprentice', 'newMember', 89),
  p('Zuri Okonkwo', 'apprentice', 'newMember', 90),
  p('Ayo Ogunseinde', 'apprentice', 'newMember', 91),
  p('Bongi Mthembu', 'apprentice', 'newMember', 92),
  p('Caleb Etiene', 'apprentice', 'newMember', 93),
  p('Doyin Olaniyi', 'apprentice', 'newMember', 94),
  p('Ekwutosi Okeke', 'apprentice', 'newMember', 95),
  p('Fola Adeleke', 'apprentice', 'newMember', 96),
  p('Gloria Ndungu', 'apprentice', 'newMember', 97),
  p('Hakeem Bello', 'apprentice', 'newMember', 98),
  p('Ijeoma Nwosu', 'apprentice', 'newMember', 99),
  p('Jabari Zuberi', 'apprentice', 'newMember', 100),
  p('Kemi Adegoke', 'apprentice', 'newMember', 101),
  p('Lindiwe Zulu', 'apprentice', 'newMember', 102),
  p('Musa Kallon', 'apprentice', 'newMember', 103),
  p('Nyasha Chigumba', 'apprentice', 'newMember', 104),
  p('Obinna Okafor', 'apprentice', 'newMember', 105),
  p('Patience Eze', 'apprentice', 'newMember', 106),
]

export const allPersonas: Persona[] = [
  ...moderators,
  ...assistants,
  ...commentators,
  ...visitors,
  ...newMembers,
]

export function groupByType(): Record<string, Persona[]> {
  const groups: Record<string, Persona[]> = {}
  for (const persona of allPersonas) {
    if (!groups[persona.type]) groups[persona.type] = []
    groups[persona.type].push(persona)
  }
  return groups
}

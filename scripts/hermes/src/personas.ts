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

// American/English roster (African placeholder names retired). Same group
// sizes, idx ranges, roles, and types as before — only the names changed.
const moderators: Persona[] = [
  p('Aaron Mitchell', 'admin', 'moderator', 1),
  p('Claire Thompson', 'admin', 'moderator', 2),
  p('Ethan Vargas', 'admin', 'moderator', 3),
]

const assistants: Persona[] = [
  p('Adam Foster', 'instructor', 'assistant', 10),
  p('Amber Coleman', 'senior_instructor', 'assistant', 11),
  p('Andrew Hayes', 'instructor', 'assistant', 12),
  p('Anna Bryant', 'instructor', 'assistant', 13),
  p('Ashley Brooks', 'instructor', 'assistant', 14),
  p('Brad Fisher', 'senior_instructor', 'assistant', 15),
  p('Ben Powell', 'instructor', 'assistant', 16),
  p('Bethany Lane', 'instructor', 'assistant', 17),
  p('Brandon Gray', 'instructor', 'assistant', 18),
  p('Brooke Jenkins', 'instructor', 'assistant', 19),
]

const commentators: Persona[] = [
  p('Bryan Marshall', 'instructor', 'commentator', 20),
  p('Cameron Dixon', 'instructor', 'commentator', 21),
  p('Carol Gibson', 'apprentice', 'commentator', 22),
  p('Chad Ellis', 'instructor', 'commentator', 23),
  p('Chelsea Reynolds', 'instructor', 'commentator', 24),
  p('Cheyenne Simpson', 'instructor', 'commentator', 25),
  p('Chris Jordan', 'instructor', 'commentator', 26),
  p('Courtney Pierce', 'instructor', 'commentator', 27),
  p('Curtis Russell', 'instructor', 'commentator', 28),
  p('Dakota Owens', 'instructor', 'commentator', 29),
  p('Dalton Watson', 'instructor', 'commentator', 30),
  p('Dana Spencer', 'instructor', 'commentator', 31),
  p('Daniel Patterson', 'apprentice', 'commentator', 32),
  p('Darcy Hughes', 'instructor', 'commentator', 33),
  p('David Flores', 'instructor', 'commentator', 34),
  p('Dawn Walters', 'instructor', 'commentator', 35),
  p('Derek Nguyen', 'apprentice', 'commentator', 36),
  p('Dillon Powell', 'instructor', 'commentator', 37),
  p('Dustin Bennett', 'instructor', 'commentator', 38),
  p('Dwight Woods', 'instructor', 'commentator', 39),
]

const visitors: Persona[] = [
  p('Eden Bishop', 'apprentice', 'visitor', 40),
  p('Eli Caldwell', 'apprentice', 'visitor', 41),
  p('Elizabeth Harper', 'apprentice', 'visitor', 42),
  p('Ellie Greene', 'apprentice', 'visitor', 43),
  p('Emily Foster', 'apprentice', 'visitor', 44),
  p('Eric Lawson', 'apprentice', 'visitor', 45),
  p('Erin Schultz', 'apprentice', 'visitor', 46),
  p('Evan Holt', 'apprentice', 'visitor', 47),
  p('Faith Robbins', 'apprentice', 'visitor', 48),
  p('Felix Dixon', 'apprentice', 'visitor', 49),
  p('Fiona Pierce', 'apprentice', 'visitor', 50),
  p('Gabe Saunders', 'apprentice', 'visitor', 51),
  p('Gavin Wheeler', 'apprentice', 'visitor', 52),
  p('Gina Larson', 'apprentice', 'visitor', 53),
  p('Grant Snyder', 'apprentice', 'visitor', 54),
  p('Hailey Cobb', 'apprentice', 'visitor', 55),
  p('Hannah Briggs', 'apprentice', 'visitor', 56),
  p('Harper Doyle', 'apprentice', 'visitor', 57),
  p('Hayden Manning', 'apprentice', 'visitor', 58),
  p('Heather Lowe', 'apprentice', 'visitor', 59),
  p('Henry Pearson', 'apprentice', 'visitor', 60),
  p('Holly Fleming', 'apprentice', 'visitor', 61),
  p('Ian Atkins', 'apprentice', 'visitor', 62),
  p('Isaac Boyd', 'apprentice', 'visitor', 63),
  p('Ivy Cummings', 'apprentice', 'visitor', 64),
  p('Jack Rowe', 'apprentice', 'visitor', 65),
  p('Jacob Frye', 'apprentice', 'visitor', 66),
  p('Jade Holland', 'apprentice', 'visitor', 67),
  p('James Pittman', 'apprentice', 'visitor', 68),
  p('Jared Salinas', 'apprentice', 'visitor', 69),
]

const newMembers: Persona[] = [
  p('Jasmine Boone', 'apprentice', 'newMember', 70),
  p('Jason Huff', 'apprentice', 'newMember', 71),
  p('Jenna Maxwell', 'apprentice', 'newMember', 72),
  p('Jeremy Lloyd', 'apprentice', 'newMember', 73),
  p('Kara Walsh', 'apprentice', 'newMember', 74),
  p('Keith Donaldson', 'apprentice', 'newMember', 75),
  p('Kelly Marsh', 'apprentice', 'newMember', 76),
  p('Kevin Barton', 'apprentice', 'newMember', 77),
  p('Abby Sullivan', 'apprentice', 'newMember', 78),
  p('Alex Rivera', 'apprentice', 'newMember', 79),
  p('Amanda Reed', 'apprentice', 'newMember', 80),
  p('Anthony Warren', 'apprentice', 'newMember', 81),
  p('Austin Cooper', 'apprentice', 'newMember', 82),
  p('Bailey Wallace', 'apprentice', 'newMember', 83),
  p('Becky Carter', 'apprentice', 'newMember', 84),
  p('Carlos Gomez', 'apprentice', 'newMember', 85),
  p('Derek Cole', 'apprentice', 'newMember', 86),
  p('Dylan Hayes', 'apprentice', 'newMember', 87),
  p('Emma Reed', 'apprentice', 'newMember', 88),
  p('Evan Brooks', 'apprentice', 'newMember', 89),
  p('Grace Turner', 'apprentice', 'newMember', 90),
  p('Hannah Pierce', 'apprentice', 'newMember', 91),
  p('Ian Wallace', 'apprentice', 'newMember', 92),
  p('Jake Sullivan', 'apprentice', 'newMember', 93),
  p('Julia Banks', 'apprentice', 'newMember', 94),
  p('Justin Cole', 'apprentice', 'newMember', 95),
  p('Katie Fischer', 'apprentice', 'newMember', 96),
  p('Lauren Webb', 'apprentice', 'newMember', 97),
  p('Marcus Reid', 'apprentice', 'newMember', 98),
  p('Mia Chapman', 'apprentice', 'newMember', 99),
  p('Nathan Cross', 'apprentice', 'newMember', 100),
  p('Olivia Dean', 'apprentice', 'newMember', 101),
  p('Patrick Foster', 'apprentice', 'newMember', 102),
  p('Rachel Bishop', 'apprentice', 'newMember', 103),
  p('Sam Rivera', 'apprentice', 'newMember', 104),
  p('Sophie Lane', 'apprentice', 'newMember', 105),
  p('Tyler Brooks', 'apprentice', 'newMember', 106),
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

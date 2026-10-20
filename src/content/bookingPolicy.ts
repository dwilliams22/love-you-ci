// Ci's booking info, transcribed word-for-word from her booking policy graphic (titles are short labels
// added for scanning). Edit wording here, not in components.

export const keyNotes = [
  { id: 'balance', title: 'Remaining balance', text: 'Balance is to be paid in cash, Zelle, or Apple Pay.' },
  { id: 'books-open', title: 'When books open', text: 'Books open monthly on the 20th of each month at 5pm.' },
  {
    id: 'off-hours',
    title: 'Earlybird, after-hours & same-day',
    text: 'Earlybird (before 10 A.M.), after-hours (after 7 P.M.), and same-day appointments are an additional $20. Please contact me to see if available.',
  },
] as const

export const businessHours = [
  { days: 'Monday & Tuesday', hours: 'Closed' },
  { days: 'Wednesday – Saturday', hours: '10 A.M. – 7 P.M.' },
  { days: 'Select Sundays', hours: '1 P.M. – 7 P.M.' },
] as const

export const studioAddress = {
  street: '2323 Lake Club Drive',
  cityLine: 'Columbus, OH 43232',
  note: 'The direct suite number is sent in the confirmation and reminder emails.',
} as const

export const addOnPrices = [
  { name: 'Mink lashes', price: '$10' },
  { name: 'Bottom lashes', price: '$5' },
  { name: 'Rhinestones', price: '$5' },
  { name: 'Pearls', price: '$5' },
] as const

export type PolicyRule = {
  id: 'deposit' | 'on-time' | 'cancellations' | 'no-guests' | 'health' | 'phone' | 'clean-face'
  title: string
  // Segments so a word can be emphasized (e.g. "prohibited") without HTML in content
  body: { text: string; emphasis?: boolean }[]
}

export const policyRules: PolicyRule[] = [
  {
    id: 'deposit',
    title: 'Deposit',
    body: [
      { text: 'A nonrefundable and non-transferrable', emphasis: true },
      {
        text: ' deposit and processing fee are required to book an appointment. The remaining balance is to be paid with Zelle, Apple Pay, or cash at your appointment.',
      },
    ],
  },
  {
    id: 'on-time',
    title: 'Arrival',
    body: [
      {
        text: 'Please be on time for your appointment. There is a 10-minute grace period. After 10 minutes, a $15 late fee is applied to the total due. After 20 minutes, the appointment is subject to cancellation.',
      },
    ],
  },
  {
    id: 'cancellations',
    title: 'Cancellations',
    body: [
      {
        text: 'If you cannot make it to your appointment, please notify me at least 24 hours in advance so the deposit can be credited to your rescheduled appointment. Same-day cancellations/reschedules will result in the appointment needing to be rebooked and deposit forfeited. No-call no-shows will be ',
      },
      { text: 'prohibited', emphasis: true },
      { text: ' from booking in the future.' },
    ],
  },
  {
    id: 'no-guests',
    title: 'No guests',
    body: [
      {
        text: 'No children or guests are allowed at your appointment. Please do not book for other people. If they are unable to do so, you may use their information instead of your own when booking.',
      },
    ],
  },
  {
    id: 'health',
    title: 'Health & skin',
    body: [
      {
        text: 'Please do not come to your appointment if you are sick or have open wounds present including scratches, gashes, and open acne bumps producing blood. In these instances, please contact me and reschedule your appointment.',
      },
    ],
  },
  {
    id: 'phone',
    title: 'Phone use',
    body: [{ text: 'Please be mindful of being on your phone during the appointment. Emergencies are understandable.' }],
  },
  {
    id: 'clean-face',
    title: 'Clean face',
    body: [
      {
        text: 'Please come to your appointment with a clean face. Arriving with makeup on will result in refusal of service. Groomed brows and exfoliated skin are highly recommended for the best makeup results.',
      },
    ],
  },
]

export const instagramHandle = 'loveyouci'

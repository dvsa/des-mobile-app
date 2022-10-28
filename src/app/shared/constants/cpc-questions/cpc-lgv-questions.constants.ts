/* eslint-disable max-len */
import { Question as CPCQuestion, Question5 } from '@dvsa/mes-test-schema/categories/CPC';

export const lgvQuestions: CPCQuestion[] = [
  {
    questionCode: 'Q01',
    title: 'Loading the vehicle',
    subtitle: 'Your fully laden vehicle is ready for you to do a delivery. Show me:',
    additionalItems: [
      'a) the checks you\'d carry out to make sure the vehicle isn\'t over-loaded',
      'b) if you\'re still in doubt, what else you could do',
    ],
    answer1: {
      selected: false,
      label: 'Check paperwork relating to the load (Or check load)',
    },
    answer2: {
      selected: false,
      label: 'Check vehicle design weight (VI Plate).',
    },
    answer3: {
      selected: false,
      label: 'Tyre checks for signs of bulging',
    },
    answer4: {
      selected: false,
      label: 'Further check by taking vehicle to nearest weigh bridge',
    },
    score: null,
  },
  {
    questionCode: 'Q02',
    title: 'Security of vehicle and contents ',
    subtitle: 'You need to leave your vehicle.',
    additionalItems: [
      'a) Where might you consider parking it?',
      'b) Explain what safety checks and security precautions you\'d take',
    ],
    answer1: {
      selected: false,
      label: 'Only park in secure, well lit vehicle parks. Where possible, park with the rear doors against a wall or backed up to another vehicle',
    },
    answer2: {
      selected: false,
      label: 'Remove keys and lock doors ',
    },
    answer3: {
      selected: false,
      label: 'Activate or explain the use of any other security features',
    },
    answer4: {
      selected: false,
      label: 'Walk around security check. For example, check the seals',
    },
    score: null,
  },
  {
    questionCode: 'Q03',
    title: 'Preventing criminality and trafficking in illegal immigrants',
    subtitle: 'You\'ve parked at a border crossing and left the vehicle unattended. Show me what checks you’d make before driving the vehicle through customs.',
    additionalItems: [],
    answer1: {
      selected: false,
      label: 'Check external compartments',
    },
    answer2: {
      selected: false,
      label: 'Check under and on top (visual if possible) of the vehicle',
    },
    answer3: {
      selected: false,
      label: 'Check inside the cab and load security. For example, check the trailer seals and curtains',
    },
    answer4: {
      selected: false,
      label: 'Check fuel cap in place (not tampered with). Visual check',
    },
    score: null,
  },
  {
    questionCode: 'Q04',
    title: 'Security of vehicle and contents',
    subtitle: 'You are about to drive a high sided vehicle on an unfamiliar route. ',
    additionalItems: [
      'a) Show me the visual checks you would make before starting your journey',
      'b) If there is any doubt of the vehicles height what else could you do?',
      'c) If you are involved in a railway bridge strike what action should you take? ',
    ],
    answer1: {
      selected: false,
      label: 'Check the vehicle height sign matches the vehicle or load',
    },
    answer2: {
      selected: false,
      label: 'Plan a suitable route / look out for any height restrictions',
    },
    answer3: {
      selected: false,
      label: 'Measure the highest point of the vehicle or load',
    },
    answer4: {
      selected: false,
      label: 'Call the police and railway authority using the bridge ID plate ',
    },
    score: null,
  },
  {
    questionCode: 'Q06',
    title: 'Loading the vehicle',
    subtitle: 'Your fully laden vehicle is ready for you to do a delivery. Show me:',
    additionalItems: [
      'a)The checks you\'d carry out to make sure the vehicle\'s not overloaded',
      'b) if you\'re still in doubt, what else you could you do',
    ],
    answer1: {
      selected: false,
      label: 'Check paperwork relating to the load (or check load)',
    },
    answer2: {
      selected: false,
      label: 'Check vehicle design weight (VI Plate) ',
    },
    answer3: {
      selected: false,
      label: 'Tyre checks for signs of bulging',
    },
    answer4: {
      selected: false,
      label: 'Further check by taking vehicle to nearest weigh bridge',
    },
    score: null,
  },
  {
    questionCode: 'Q07',
    title: 'Preventing criminality and trafficking in illegal immigrants',
    subtitle: 'You\'ve had a comfort break just before boarding a cross channel ferry. Show me what checks you\'d make to this vehicle before driving through customs.',
    additionalItems: [''],
    answer1: {
      selected: false,
      label: 'Check external compartments',
    },
    answer2: {
      selected: false,
      label: 'Check under and on top (visual, if possible) of the vehicle ',
    },
    answer3: {
      selected: false,
      label: 'Check inside the cab and load security. For example, check the trailer seals and curtains',
    },
    answer4: {
      selected: false,
      label: 'Check fuel cap in place (not tampered with). Visual check',
    },
    score: null,
  },
  {
    questionCode: 'Q08',
    title: 'Loading the vehicle',
    subtitle: 'You\'ve been asked to collect half a load of steel plates on an empty vehicle. Show me:',
    additionalItems: [
      'a) by pointing to the correct distribution area(s) on this vehicle, where the load should be placed',
      'b) which restraining device you\'d use to secure the load ',
      'c) how you\'d secure the load with the restraining device, using the load securing trolley',
      'd) how you\'d release the restraining device.',
    ],
    answer1: {
      selected: false,
      label: 'Shows by pointing to the correct distribution area (against the headboard)',
    },
    answer2: {
      selected: false,
      label: 'Selects correct restraint item - chain / tensioner',
    },
    answer3: {
      selected: false,
      label: 'Demonstrates competence in use of chain / tensioner',
    },
    answer4: {
      selected: false,
      label: 'Demonstrates how to release the restraining device',
    },
    score: null,
  },
  {
    questionCode: 'Q09',
    title: 'Assessing Emergency Situations',
    subtitle: 'You suspect a brake fault on this vehicle. Show me:',
    additionalItems: [
      'a) what checks you can carry out to make sure the compressor is working properly ',
      'b) any checks you could make to identify air leaks',
    ],
    answer1: {
      selected: false,
      label: 'Emptying the air tanks by pumping the footbrake',
    },
    answer2: {
      selected: false,
      label: 'Restarting the engine and making sure the compressor recharges the system',
    },
    answer3: {
      selected: false,
      label: 'Stop the engine, apply footbrake and listen for leaks',
    },
    answer4: {
      selected: false,
      label: 'Physical check of the air system to make sure air lines are serviceable',
    },
    score: null,
  },
  {
    questionCode: 'Q10',
    title: 'Loading the vehicle',
    subtitle: 'You\'re about to make a very long journey beyond the fuel range of this vehicle.',
    additionalItems: [
      'a) Show me what checks you\'d make to this vehicle\'s fuel system',
      'b) Explain what precautions you\'d take to make sure you don\'t run out of fuel'],
    answer1: {
      selected: false,
      label: 'Checks enough fuel for the first stage of the journey (instrument check)',
    },
    answer2: {
      selected: false,
      label: 'Checks fuel tank and mountings for condition',
    },
    answer3: {
      selected: false,
      label: 'Vehicle fuel card, or means to buy fuel on the journey if necessary',
    },
    answer4: {
      selected: false,
      label: 'Checks fuel fill level and fuel cap security',
    },
    score: null,
  },
  {
    questionCode: 'Q11',
    title: 'Assessing emergency situations',
    subtitle: 'You\'re driving on a motorway and flames appear from the engine compartment. Show me:',
    additionalItems: [
      'a) how you’d deal with this small electrical wiring fire',
      'b) which is the appropriate fire extinguisher to use on this fire',
    ],
    answer1: {
      selected: false,
      label: 'Stop as quickly and safely as possible on the hard shoulder. ',
    },
    answer2: {
      selected: false,
      label: 'Identifies correct extinguisher to use on electrical system fire (CO2 / Powder) (Refer to photograph)',
    },
    answer3: {
      selected: false,
      label: 'Awareness of need to contact emergency services',
    },
    answer4: {
      selected: false,
      label: 'Isolate the vehicle (disconnect electric supply)',
    },
    score: null,
  },
  {
    questionCode: 'Q12',
    title: 'Loading the vehicle',
    subtitle: 'Show me: ',
    additionalItems: [
      'a) how you\'d check the maximum authorised mass of this vehicle',
      'b) what other checks you\'d carry out to make sure the vehicle\'s not overloaded',
      'c) if you\'re still in doubt, what else you could do',
    ],
    answer1: {
      selected: false,
      label: 'Check vehicle design weight (VI Plate)',
    },
    answer2: {
      selected: false,
      label: 'Check paperwork relating to the load (or check load)',
    },
    answer3: {
      selected: false,
      label: 'Tyre checks for signs of bulging',
    },
    answer4: {
      selected: false,
      label: 'Further check by taking vehicle to nearest weigh bridge',
    },
    score: null,
  },
  {
    questionCode: 'Q13',
    title: 'Security of vehicle and contents ',
    subtitle: 'You\'ve been given a different vehicle to drive for the day. Show me all of the practical and visual safety checks you\'d make before driving the vehicle. ',
    additionalItems: [],
    answer1: {
      selected: false,
      label: 'Daily walkround check',
    },
    answer2: {
      selected: false,
      label: 'Is aware of vehicle height (sign check), width and weight',
    },
    answer3: {
      selected: false,
      label: 'Cockpit drill to include warning system checks',
    },
    answer4: {
      selected: false,
      label: 'Enough fuel for the journey',
    },
    score: null,
  },
  {
    questionCode: 'Q14',
    title: 'Loading the vehicle',
    subtitle: 'You\'ve delivered part of your load and are left with half a load of empty roller cages inside your box van. Show me:',
    additionalItems: [
      'a) by pointing to the correct distribution area(s) on this vehicle, where this load should be placed',
      'b) which restraining device you\'d use to secure the load',
      'c) how you\'d secure the load with the restraining device',
      'd) how you\'d release the restraining device',
    ],
    answer1: {
      selected: false,
      label: 'Load to be placed up against the head board',
    },
    answer2: {
      selected: false,
      label: 'Selects correct restraint item - load tensioning bar/webbing straps',
    },
    answer3: {
      selected: false,
      label: 'Demonstrates competence in use of load tensioning bar/webbing straps',
    },
    answer4: {
      selected: false,
      label: 'Demonstrates how to release the restraining device',
    },
    score: null,
  },
  {
    questionCode: 'Q15',
    title: 'Preventing criminality and trafficking in illegal immigrants',
    subtitle: 'You\'ve parked at the docks and, following a rest break, you suspect your vehicle may have been tampered with. Show me what checks you\'d make around and inside your vehicle before continuing your journey.',
    additionalItems: [],
    answer1: {
      selected: false,
      label: 'Check external compartments',
    },
    answer2: {
      selected: false,
      label: 'Check under and on top (visual if possible) of the vehicle',
    },
    answer3: {
      selected: false,
      label: 'Check inside the cab and load security. For example, check the trailer seals and curtains',
    },
    answer4: {
      selected: false,
      label: 'Check fuel cap in place (not tampered with). Visual check',
    },
    score: null,
  },
];

export const lgvQuestion5: Question5 = {
  questionCode: 'Q05',
  title: 'Ability to prevent physical risk',
  subtitle: 'Show me and explain the daily safety checks you\'d make to this vehicle before driving on the road.',
  additionalItems: [],
  answer1: {
    selected: false,
    label: 'Brakes',
  },
  answer2: {
    selected: false,
    label: 'Horn',
  },
  answer3: {
    selected: false,
    label: 'Exhaust system(s)',
  },
  answer4: {
    selected: false,
    label: 'Lights / Reflectors',
  },
  answer5: {
    selected: false,
    label: 'Mirrors',
  },
  answer6: {
    selected: false,
    label: 'Instrument panel warning lights',
  },
  answer7: {
    selected: false,
    label: 'Tyres / Wheel fixings ',
  },
  answer8: {
    selected: false,
    label: 'Height marker',
  },
  answer9: {
    selected: false,
    label: 'Wipers / Washers',
  },
  answer10: {
    selected: false,
    label: 'Air leaks',
  },
  score: null,
};

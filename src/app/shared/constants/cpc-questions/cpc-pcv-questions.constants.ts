/* eslint-disable max-len */
import { Question as CPCQuestion, Question5 } from '@dvsa/mes-test-schema/categories/CPC';

export const pcvQuestions: CPCQuestion[] = [
  {
    questionCode: 'Q01',
    title: 'Loading the vehicle',
    subtitle: '',
    additionalItems: [
      'a) Where would you find the unladen weight of this vehicle?',
      'b) How much extra weight would there be if 15 passengers boarded?',
      'c) And if they were carrying a case each?',
      'd) How much weight would 100 litres of fuel add?',
    ],
    answer1: {
      selected: false,
      label: 'Should be displayed on the nearside of the vehicle',
    },
    answer2: {
      selected: false,
      label: '15 passengers = I000Kg / 1 Tonne',
    },
    answer3: {
      selected: false,
      label: '15 cases = 330kg / 0.33 tonnes',
    },
    answer4: {
      selected: false,
      label: '100 litres fuel = 100Kg / 0.1 tonne',
    },
    score: 0,
  },
  {
    questionCode: 'Q02',
    title: 'Loading the vehicle',
    subtitle: '',
    additionalItems: [
      'a) Where would you find the unladen weight of this vehicle?',
      'b) How much extra weight would there be if 45 passengers boarded?',
      'c) And if they were carrying a case each?',
      'd) How much weight would 250 litres of fuel add?',
    ],
    answer1: {
      selected: false,
      label: 'Should be displayed on the nearside of the vehicle',
    },
    answer2: {
      selected: false,
      label: '45 passengers = 3000kg / 3 tonnes',
    },
    answer3: {
      selected: false,
      label: '45 cases = 1000kg / 1 tonne',
    },
    answer4: {
      selected: false,
      label: '250 litres fuel = 250kg / 0.25 tonne',
    },
    score: 0,
  },
  {
    questionCode: 'Q03',
    title: 'Security of the vehicle and contents',
    subtitle: 'Show me how you\'d check all the passenger seats on the vehicle for comfort and safety.',
    additionalItems: [],
    answer1: {
      selected: false,
      label: 'Seat should be looked over very thoroughly, including a check on the anchor points to the floor',
    },
    answer2: {
      selected: false,
      label: 'If a cushion is separately fitted, must be checked to make sure it won\'t detach from the seat when the vehicle brakes',
    },
    answer3: {
      selected: false,
      label: 'Make sure nothing sharp can snag skin or clothes, such as loose trim',
    },
    answer4: {
      selected: false,
      label: 'Trim should be clean',
    },
    score: 0,
  },
  {
    questionCode: 'Q04',
    title: 'Preventing criminality and trafficking illegal immigrants',
    subtitle: 'You\'ve parked at a border crossing and you and your passengers have left the vehicle unattended. Show me what security checks you\'d make before driving through customs.',
    additionalItems: [],
    answer1: {
      selected: false,
      label: 'Check all lockers and compartments',
    },
    answer2: {
      selected: false,
      label: 'Check under all seating areas',
    },
    answer3: {
      selected: false,
      label: 'Check fuel cap hasn\'t been tampered with ',
    },
    answer4: {
      selected: false,
      label: 'Check the passenger list to make sure you\'ve got the correct numbers of legitimate passengers',
    },
    score: 0,
  },
  {
    questionCode: 'Q06',
    title: 'Ability to assess emergency situations',
    subtitle: 'You\'re driving on a motorway and flames appear from the engine compartment. Show me:',
    additionalItems: [
      'a) how you’d deal with this small electrical wiring fire',
      'b) which is the appropriate fire extinguisher to use on this fire',
    ],
    answer1: {
      selected: false,
      label: 'Stop as quickly and safely as possible on the hard shoulder',
    },
    answer2: {
      selected: false,
      label: 'Identifies correct extinguisher to use on electrical system fire (CO2 / Powder) (Refer to photograph)',
    },
    answer3: {
      selected: false,
      label: 'Knows to contact emergency services',
    },
    answer4: {
      selected: false,
      label: 'Isolate the vehicle (disconnect electric supply)',
    },
    score: 0,
  },
  {
    questionCode: 'Q07',
    title: 'Loading the vehicle',
    subtitle: 'A wheelchair user wants to board your vehicle. Show me or explain:',
    additionalItems: [
      'a) the different access points on the vehicle which a wheelchair user might use\n',
      'b) the docking area for wheelchairs on this vehicle',
      'c) which way the wheelchair should face',
      'd) What would you do if the wheelchair docking area is occupied by another passenger',
    ],
    answer1: {
      selected: false,
      label: 'Shows different access points for a wheelchair user (Refer to photograph 7A)',
    },
    answer2: {
      selected: false,
      label: 'Candidate to point out where in the vehicle a wheelchair must be parked (Refer to photograph 7B)',
    },
    answer3: {
      selected: false,
      label: 'Which way the chair must face chair facing towards the rear  (Refer to photograph 7A)',
    },
    answer4: {
      selected: false,
      label: 'Ask the passenger to move to another seat if possible / refer to company policy',
    },
    score: 0,
  },
  {
    questionCode: 'Q08',
    title: 'Ability to assess emergency situations',
    subtitle: 'You\'re driving a loaded vehicle on a motorway and flames appear from around one of your tyres. Tell me:',
    additionalItems: [
      'a) how you\'d deal with this small fire?',
      'b) which of these extinguishers would be the best to use on the fire?',
    ],
    answer1: {
      selected: false,
      label: 'Stop as quickly and safely as possible',
    },
    answer2: {
      selected: false,
      label: 'Get all passengers off the vehicle and contact the emergency services',
    },
    answer3: {
      selected: false,
      label: 'Identifies how to isolate the electric supply and fuel cut off switch',
    },
    answer4: {
      selected: false,
      label: ' Identifies water or foam extinguisher(s) (refer to picture)',
    },
    score: 0,
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
    score: 0,
  },
  {
    questionCode: 'Q10',
    title: 'Security of vehicle and contents',
    subtitle: 'Show me how you\'d check the vehicle interior for passenger comfort and safety.',
    additionalItems: [''],
    answer1: {
      selected: false,
      label: 'Check overhead luggage rack, grab rails to make sure they\'re fitted securely',
    },
    answer2: {
      selected: false,
      label: 'Check trim is secure and not loose, check for any sharp objects',
    },
    answer3: {
      selected: false,
      label: 'Check floor is in good condition and clean',
    },
    answer4: {
      selected: false,
      label: 'Check for anything that could cause slips/trips or could cause soil/damage to clothing',
    },
    score: 0,
  },
  {
    questionCode: 'Q11',
    title: 'Ability to assess emergency situations',
    subtitle: 'Walk around the vehicle and:',
    additionalItems: [
      'a) explain what projections and overhangs there are',
      'b) describe what allowances you\'d have to make for these projections and overhangs when you\'re driving the vehicle',
    ],
    answer1: {
      selected: false,
      label: 'Identify overhangs and projections',
    },
    answer2: {
      selected: false,
      label: 'Overhangs can sweep over kerbs when turning, colliding with street furniture, pedestrians other vehicles and your vehicle',
    },
    answer3: {
      selected: false,
      label: 'Mirror projections can come into contact with street furniture, pedestrian and other vehicles',
    },
    answer4: {
      selected: false,
      label: 'Good all round observation is required, as well as extensive use of mirrors, to check for any rear end sweep',
    },
    score: 0,
  },
  {
    questionCode: 'Q12',
    title: 'Security of vehicle and contents',
    subtitle: 'You\'re driving a different vehicle for the first time. Show me all the practical and visual safety checks you\'d make to familiarise yourself with this new vehicle.',
    additionalItems: [],
    answer1: {
      selected: false,
      label: 'Is aware of vehicle height (sign check) ',
    },
    answer2: {
      selected: false,
      label: 'Cockpit drill to include: doors closed and operating correctly, seat secure and correctly adjusted, steering correctly adjusted, seatbelt working, mirrors clean and correctly adjusted. DSSSM',
    },
    answer3: {
      selected: false,
      label: 'Finds safety equipment, first aid kit, fire extinguisher, emergency door, hammer (If appropriate)',
    },
    answer4: {
      selected: false,
      label: 'Enough fuel for the journey, Ad Blue (If appropriate)',
    },
    score: 0,
  },
  {
    questionCode: 'Q13',
    title: 'Ability to assess emergency situations',
    subtitle: 'You\'re driving along a busy main road and are alerted to a small fire which is centred around the fuel system. Show me:',
    additionalItems: [
      'a) how you\'d deal with this situation ',
      'b) which extinguisher you would NOT use on a fuel fire',
    ],
    answer1: {
      selected: false,
      label: 'Stop as quickly and safely as possible.',
    },
    answer2: {
      selected: false,
      label: 'Identifies appropriate extinguisher(s)',
    },
    answer3: {
      selected: false,
      label: 'Get all passengers off the vehicle and contact the emergency services',
    },
    answer4: {
      selected: false,
      label: 'Isolate the vehicle disconnect electric supply and isolate fuel cut off switch',
    },
    score: 0,
  },
  {
    questionCode: 'Q14',
    title: 'Ability to assess emergency situations',
    subtitle: 'What safety checks do you need to make before moving away from a bus stop, after an elderly infirm passenger or wheelchair user boards your vehicle?',
    additionalItems: [''],
    answer1: {
      selected: false,
      label: 'Make sure the \'kneeling\' facility /wheel chair ramp is safely secured',
    },
    answer2: {
      selected: false,
      label: 'All doors closed before moving away',
    },
    answer3: {
      selected: false,
      label: 'All passengers have reached a secure and safe position',
    },
    answer4: {
      selected: false,
      label: 'Check nearside mirror for any late passengers before moving away',
    },
    score: 0,
  },
  {
    questionCode: 'Q15',
    title: 'Ability to assess emergency situations',
    subtitle: 'Your stationary vehicle is full of passengers. The engine\'s running and you\'re in the driving seat. You\'ve just been involved in a road traffic incident. What would you do?',
    additionalItems: [],
    answer1: {
      selected: false,
      label: 'Switch off engine',
    },
    answer2: {
      selected: false,
      label: 'Warn other traffic by using hazard warning lights, beacons, cones or advance warning triangle',
    },
    answer3: {
      selected: false,
      label: 'Check passengers for injury',
    },
    answer4: {
      selected: false,
      label: 'Contact emergency services',
    },
    score: 0,
  },
  {
    questionCode: 'Q16',
    title: 'Security of vehicle and contents',
    subtitle: '',
    additionalItems: [
      'a) Show me how you\'d check all seat belts for their condition.',
      'b) What are the legal requirements for their use?',
      'c) What\'s your responsibility in this matter?',
    ],
    answer1: {
      selected: false,
      label: 'Securely fitted at anchor points, and tug to check',
    },
    answer2: {
      selected: false,
      label: 'Belt is clean and in good condition',
    },
    answer3: {
      selected: false,
      label: 'Signs must be in place to tell passengers that seat belts must be worn if fitted',
    },
    answer4: {
      selected: false,
      label: 'Driver must make sure all passengers understand signs and legal requirements',
    },
    score: 0,
  },
  {
    questionCode: 'Q17',
    title: 'Preventing criminality and trafficking in illegal immigrants',
    subtitle: 'You and your passengers had a comfort break just before boarding a cross channel ferry. Show me what checks you\'d make to this vehicle before driving through customs.',
    additionalItems: [''],
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
      label: 'Check under all seating areas',
    },
    answer4: {
      selected: false,
      label: 'Check the passenger list to make sure you\'ve got the correct numbers of legitimate passengers',
    },
    score: 0,
  },
  {
    questionCode: 'Q18',
    title: 'Preventing criminality and trafficking in illegal immigrants',
    subtitle: 'You and your passengers have returned to your vehicle after a rest break. You suspect that your vehicle may have been tampered with. What checks would you make before driving through customs?',
    additionalItems: [''],
    answer1: {
      selected: false,
      label: 'Check external and internal compartments',
    },
    answer2: {
      selected: false,
      label: 'Check under and on top (visual if possible) of the vehicle',
    },
    answer3: {
      selected: false,
      label: 'Check under all seating areas',
    },
    answer4: {
      selected: false,
      label: 'Check the passenger list to make sure you\'ve got the correct numbers of legitimate passengers',
    },
    score: 0,
  },
];

export const pcvQuestion5: Question5 = {
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
  score: 0,
};

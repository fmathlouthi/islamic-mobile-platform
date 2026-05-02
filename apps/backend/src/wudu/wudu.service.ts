import { Injectable } from '@nestjs/common';
import { WuduStep } from '@tariq/shared';

@Injectable()
export class WuduService {
  private readonly wuduSteps: WuduStep[] = [
    {
      id: 1,
      title: 'Niyyah (Intention)',
      arabicTitle: 'النية',
      description: 'Make a sincere intention in your heart to perform wudu for the sake of Allah. Say "Bismillah" (In the name of Allah).',
      imageUrl: 'https://placehold.co/600x400?text=Step+1:+Niyyah',
    },
    {
      id: 2,
      title: 'Washing Hands',
      arabicTitle: 'غسل اليدين',
      description: 'Wash your hands up to the wrists three times, making sure water reaches between your fingers.',
      imageUrl: 'https://placehold.co/600x400?text=Step+2:+Hands',
    },
    {
      id: 3,
      title: 'Rinsing Mouth',
      arabicTitle: 'المضمضة',
      description: 'Take water into your mouth with your right hand and rinse it thoroughly three times.',
      imageUrl: 'https://placehold.co/600x400?text=Step+3:+Mouth',
    },
    {
      id: 4,
      title: 'Rinsing Nose',
      arabicTitle: 'الاستنشاق',
      description: 'Snuff water into your nostrils with your right hand and blow it out with your left hand three times.',
      imageUrl: 'https://placehold.co/600x400?text=Step+4:+Nose',
    },
    {
      id: 5,
      title: 'Washing Face',
      arabicTitle: 'غسل الوجه',
      description: 'Wash your entire face three times, from the hairline to the chin and from ear to ear.',
      imageUrl: 'https://placehold.co/600x400?text=Step+5:+Face',
    },
    {
      id: 6,
      title: 'Washing Arms',
      arabicTitle: 'غسل الذراعين',
      description: 'Wash your right arm up to and including the elbow three times, then do the same for the left arm.',
      imageUrl: 'https://placehold.co/600x400?text=Step+6:+Arms',
    },
    {
      id: 7,
      title: 'Wiping Head and Ears',
      arabicTitle: 'مسح الرأس والأذنين',
      description: 'Wipe your head with wet hands from front to back and back to front once. Then use your index fingers to wipe the inside of your ears and your thumbs for the outside.',
      imageUrl: 'https://placehold.co/600x400?text=Step+7:+Head+and+Ears',
    },
    {
      id: 8,
      title: 'Washing Feet',
      arabicTitle: 'غسل القدمين',
      description: 'Wash your right foot up to the ankle three times, including between the toes. Then do the same for the left foot.',
      imageUrl: 'https://placehold.co/600x400?text=Step+8:+Feet',
    },
  ];

  getWuduGuide(): WuduStep[] {
    return this.wuduSteps;
  }
}

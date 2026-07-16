import Yoga1 from '../../assets/yoga1.svg';
import Yoga2 from '../../assets/yoga 2.svg';
import Yoga3 from '../../assets/yoga 3.svg';
import Yoga4 from '../../assets/yoga 4.svg';

export interface YogaItem {
  id: number;
  img: string;
  title: string;
  desc: string;
  videoUrl?: string;
}

// ExerciseTab Page Constants
export const EXERCISE_TAB_CONSTANTS = {
  YOGA_CARD_FLEX: '1 1 350px',
  YOGA_CARD_RADIUS: '24px',
  YOGA_CARD_PADDING: '94px 24px 32px',
  YOGA_CARD_GAP: '8px',
  
  LOTUS_ICON_WIDTH: '120px',
  LOTUS_ICON_HEIGHT: '108px',
  LOTUS_ICON_TOP: '-30px',
  
  BUTTON_RADIUS: '12px',
  BUTTON_PADDING: '8px 24px',
  
  RECOMMENDED_GRID_GAP: '24px',
  RECOMMENDED_CARD_PADDING: '16px',
  RECOMMENDED_IMAGE_HEIGHT: '180px',
  
  RECOMMENDED_YOGA: [
    { id: 1, img: Yoga1, title: "Today's Top Hits", desc: "Pranayama is on top of the\nExcercise!", videoUrl: '/yoga.mp4' },
    { id: 2, img: Yoga2, title: "Flexibility Routine", desc: "Pranayama is on top of the\nExcercise!", videoUrl: '/yoga.mp4' },
    { id: 3, img: Yoga3, title: "Strength & Balance", desc: "Pranayama is on top of the\nExcercise!", videoUrl: '/yoga.mp4' },
    { id: 4, img: Yoga4, title: "Mindfulness Flow", desc: "Pranayama is on top of the\nExcercise!", videoUrl: '/yoga.mp4' },
  ] as YogaItem[]
};

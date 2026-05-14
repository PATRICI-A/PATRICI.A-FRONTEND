import * as React from 'react';
import {
  Cpu, Monitor, Zap, Radio,
  Leaf, Droplets, TreePine,
  Coffee, UtensilsCrossed, ShoppingBag, Truck,
  Users, Globe,
  Music, Headphones, Palette, Film, BookOpen, Library,
  Dumbbell, Trophy, Activity, Heart, HeartPulse,
  GraduationCap, FlaskConical, BookMarked,
  Building2, MapPin, Car, Navigation,
  Star, Sparkles, Crown, Rocket, Lightbulb,
  Brain, Megaphone, MessageSquare, Bell,
  Smile, SmilePlus, Meh, Frown,
  Moon, Sun, Flame, Wrench, HardHat,
  Camera, Search, LayoutGrid, Mountain, ChefHat, Clock, Gamepad2,
  Target, BarChart2, CheckCircle, HandHeart,
} from 'lucide-react';
type LucideIcon = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}>;
const EMOJI_MAP: Array<[string[], LucideIcon]> = [
  [['💻', '🖥️', '⌨️'],               Monitor       ],
  [['🤖', '🧬'],                       Cpu           ],
  [['📡', '📶'],                       Radio         ],
  [['📱'],                             Monitor       ],
  [['🔌', '⚡', '🔋'],                 Zap           ],
  [['🌐', '🌍', '🌎', '🌏'],          Globe         ],
  [['📸', '📷'],                       Camera        ],
  [['🔍', '🔎'],                       Search        ],
  [['🪟'],                             LayoutGrid    ],
  [['🎮', '🕹️'],                       Gamepad2      ],
  [['🎓', '🏫'],                       GraduationCap ],
  [['📚', '📖', '📕', '📗'],           BookOpen      ],
  [['📘', '📙', '📔', '📒'],           BookMarked    ],
  [['🔬', '🧪', '🔭'],                 FlaskConical  ],
  [['🧠'],                             Brain         ],
  [['💡'],                             Lightbulb     ],
  [['🎯'],                             Target        ],
  [['📊', '📈', '📉'],                 BarChart2     ],
  [['🤝', '🤜', '🤛', '👥', '👫'],   Users         ],
  [['😄', '😁'],                       SmilePlus     ],
  [['🤩', '😊'],                       Smile         ],
  [['😐', '😑', '😶'],                Meh           ],
  [['😔', '😞', '😣'],                Frown         ],
  [['😢', '😭', '😥'],                Frown         ],
  [['📢', '📣', '🔊'],                Megaphone     ],
  [['💬', '🗣️'],                      MessageSquare ],
  [['🔔', '🔕'],                       Bell          ],
  [['🎵', '🎶', '🎸', '🎷', '🎺'],          Music         ],
  [['🎧', '🎤'],                       Headphones    ],
  [['🎨', '🖌️', '🖼️'],                Palette       ],
  [['🎬', '🎥', '📽️', '🎞️'],          Film          ],
  [['💃', '🕺'],                       Music         ],
  [['🦚', '🎭'],                       Library       ],
  [['⚽', '🏀', '🎾', '🏈'],          Activity      ],
  [['💪', '🏋️', '🤸'],                Dumbbell      ],
  [['🏃', '🚴', '🤾'],                Activity      ],
  [['🏆', '🥇', '🎖️', '🏅'],          Trophy        ],
  [['❤️', '💖', '💕', '💚', '💛', '💙'], Heart     ],
  [['💆', '🧘', '🛁', '🩺'],          HeartPulse    ],
  [['🤗', '🫂'],                       HandHeart     ],
  [['🏔️', '⛰️', '🏕️'],                Mountain      ],
  [['👨‍🍳', '🧑‍🍳', '🍳'],               ChefHat       ],
  [['⏱', '⏰', '⏳', '🕐'],           Clock         ],
  [['🏟️', '🏛️', '🏣', '🏢', '🏬'],  Building2     ],
  [['📍', '📌', '🗺️'],                MapPin        ],
  [['🚗', '🚙', '🚘'],                Car           ],
  [['🚶', '🚶‍♂️', '🚶‍♀️'],             Navigation    ],
  [['🚚', '🚛'],                       Truck         ],
  [['🌊', '💧'],                       Droplets      ],
  [['🌿', '🌱', '🍃', '🌳'],          Leaf          ],
  [['🌲', '🎋'],                       TreePine      ],
  [['☕', '🍵', '🧃'],                 Coffee        ],
  [['🍽️', '🥗', '🍜'],                UtensilsCrossed],
  [['🍔', '🍕', '🌮', '🌯'],          ShoppingBag   ],
  [['⭐', '🌟', '✨', '💫'],           Star          ],
  [['🎆', '🎇', '🎉'],                Sparkles      ],
  [['👑', '🎩'],                       Crown         ],
  [['🚀'],                             Rocket        ],
  [['🔥', '🌋'],                       Flame         ],
  [['✅', '☑️'],                       CheckCircle   ],
  [['🆘'],                             HeartPulse    ],
  [['🔧', '🔩', '⚙️'],                Wrench        ],
  [['🏗️', '⛏️'],                       HardHat       ],
  [['🌙', '😴'],                       Moon          ],
  [['☀️', '🌤️'],                       Sun           ],
  [['🐾', '🐶', '🐱', '🐻', '🦊'],   Star          ],
  [['🐛', '🐞', '🦋'],                Leaf          ],
];
export interface EmojiIconProps {
  emoji: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}
export function EmojiIcon({
  emoji,
  size = 16,
  color = 'currentColor',
  strokeWidth = 2,
  className,
}: EmojiIconProps) {
  for (const [emojis, Icon] of EMOJI_MAP) {
    if (emojis.some(e => emoji.includes(e))) {
      return (
        <Icon
          size={size}
          color={color}
          strokeWidth={strokeWidth}
          className={className}
        />
      );
    }
  }
  return (
    <Sparkles
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
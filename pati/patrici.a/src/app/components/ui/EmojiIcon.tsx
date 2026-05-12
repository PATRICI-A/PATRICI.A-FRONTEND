/**
 * EmojiIcon — converts app emojis into monochrome Lucide icons.
 *
 * Usage:
 *   <EmojiIcon emoji={ev.emoji} size={20} color="#06B6D4" />
 *
 * Falls back to <Sparkles> for unknown emojis.
 */
import React from 'react';
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

// ── Emoji → Lucide icon mapping ────────────────────────────────────────────
const EMOJI_MAP: Array<[string[], LucideIcon]> = [
  // Tech
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

  // Academic
  [['🎓', '🏫'],                       GraduationCap ],
  [['📚', '📖', '📕', '📗'],           BookOpen      ],
  [['📘', '📙', '📔', '📒'],           BookMarked    ],
  [['🔬', '🧪', '🔭'],                 FlaskConical  ],
  [['🧠'],                             Brain         ],
  [['💡'],                             Lightbulb     ],
  [['🎯'],                             Target        ],
  [['📊', '📈', '📉'],                 BarChart2     ],

  // Social
  [['🤝', '🤜', '🤛', '👥', '👫'],   Users         ],
  [['😄', '😁'],                       SmilePlus     ],
  [['🤩', '😊'],                       Smile         ],
  [['😐', '😑', '😶'],                Meh           ],
  [['😔', '😞', '😣'],                Frown         ],
  [['😢', '😭', '😥'],                Frown         ],
  [['📢', '📣', '🔊'],                Megaphone     ],
  [['💬', '🗣️'],                      MessageSquare ],
  [['🔔', '🔕'],                       Bell          ],

  // Culture / art
  [['🎵', '🎶', '🎸', '🎷', '🎺'],          Music         ],
  [['🎧', '🎤'],                       Headphones    ],
  [['🎨', '🖌️', '🖼️'],                Palette       ],
  [['🎬', '🎥', '📽️', '🎞️'],          Film          ],
  [['💃', '🕺'],                       Music         ],
  [['🦚', '🎭'],                       Library       ],

  // Sport / wellness
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

  // Campus / location
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

  // Gamification
  [['⭐', '🌟', '✨', '💫'],           Star          ],
  [['🎆', '🎇', '🎉'],                Sparkles      ],
  [['👑', '🎩'],                       Crown         ],
  [['🚀'],                             Rocket        ],
  [['🔥', '🌋'],                       Flame         ],
  [['✅', '☑️'],                       CheckCircle   ],
  [['🆘'],                             HeartPulse    ],

  // Misc
  [['🔧', '🔩', '⚙️'],                Wrench        ],
  [['🏗️', '⛏️'],                       HardHat       ],
  [['🌙', '😴'],                       Moon          ],
  [['☀️', '🌤️'],                       Sun           ],

  // Monas / animal emojis → generic star
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
  // Fallback for unmapped emojis
  return (
    <Sparkles
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
}
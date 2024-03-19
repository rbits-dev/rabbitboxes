import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rarity',
  templateUrl: './rarity.component.html',
  styleUrls: ['./rarity.component.scss']
})
export class RarityComponent implements OnInit {

  static readonly routeName: string = 'rarity';

  sortedOnRarity = false;

  rarityLevels = [
    [20, 100],
    [5, 19.99],
    [1, 4.99],
    [0, 0.99]
  ]

  categories = [
    'Animated Background',
    'Static Background',
    'Flag',
    'Laser Sword',
    'Chest',
    'Moon',
    'Visor',
    'Badge',
    'Gloves',
    'Color',
    //'Tier',
  ]

  items = [
    {
      name: 'Animated Floating In Space',
      image: '01_Animated-floating-in-space.webp',
      category: 'Animated Background',
      rarityNumber: 10,
      rarityPercentage: 1,
    },
    {
      name: 'Animated Inside The Rocket',
      image: '02_Animated-inside-the-rocket.webp',
      category: 'Animated Background',
      rarityNumber: 9,
      rarityPercentage: 0.9,
    },
    {
      name: 'Animated In Front Of The Rocket',
      image: '03_Animated-in-front-of-the-rocket.webp',
      category: 'Animated Background',
      rarityNumber: 11,
      rarityPercentage: 1.1,
    },
    {
      name: 'Animated Asteroids',
      image: '04_Animated-asteroids.webp',
      category: 'Animated Background',
      rarityNumber: 10,
      rarityPercentage: 1,
    },
    {
      name: 'Animated Astronaut in the Ocean',
      image: '05_Animated-astronaut-in-the-ocean.webp',
      category: 'Animated Background',
      rarityNumber: 10,
      rarityPercentage: 1,
    },
    {
      name: 'Static Astronaut In Ocean',
      image: '11_Static-BG-Astronaut-in-ocean.webp',
      category: 'Static Background',
      rarityNumber: 25,
      rarityPercentage: 2.5,
    },
    {
      name: 'Static In Front Of Rocket',
      image: '10_Static-BG-in-front-of-rocket.webp',
      category: 'Static Background',
      rarityNumber: 47,
      rarityPercentage: 4.7,
    },
    {
      name: 'Static Asteroids',
      image: '09_Static-BG-Asteroids.webp',
      category: 'Static Background',
      rarityNumber: 71,
      rarityPercentage: 7.1,
    },
    {
      name: 'Static Inside The Rocket',
      image: '08_Static-BG-inside-the-rocket.webp',
      category: 'Static Background',
      rarityNumber: 95,
      rarityPercentage: 9.5,
    },
    {
      name: 'Static Floating In Space',
      image: '07_Static-BG-Floating-in-space.webp',
      category: 'Static Background',
      rarityNumber: 238,
      rarityPercentage: 23.8,
    },
    {
      name: 'Static Standing On the Moon',
      image: '06_Static-BG-standing-on-the-moon.webp',
      category: 'Static Background',
      rarityNumber: 468,
      rarityPercentage: 46.8,
    },
    {
      name: 'Flag RBITS Logo',
      image: '12_Flag_Moonshot_logo.webp',
      category: 'Flag',
      rarityNumber: 425,
      rarityPercentage: 42.5,
    },
    {
      name: 'Laser Sword Green',
      image: '13_Laser-Sword-green.webp',
      category: 'Laser Sword',
      rarityNumber: 174,
      rarityPercentage: 17.4,
    },
    {
      name: 'Laser Sword Red',
      image: '14_Laser-Sword-red.webp',
      category: 'Laser Sword',
      rarityNumber: 176,
      rarityPercentage: 17.6,
    },

    {
      name: 'Diamond Chest',
      image: '18_Diamond-chest.webp',
      category: 'Chest',
      rarityNumber: 10,
      rarityPercentage: 1,
    },
    {
      name: 'Gold Chest',
      image: '17_Gold-chest.webp',
      category: 'Chest',
      rarityNumber: 40,
      rarityPercentage: 4,
    },
    {
      name: 'Silver Chest',
      image: '16_-Silver-chest.webp',
      category: 'Chest',
      rarityNumber: 60,
      rarityPercentage: 6,
    },
    {
      name: 'Wooden Chest',
      image: '15_Wooden-chest.webp',
      category: 'Chest',
      rarityNumber: 16,
      rarityPercentage: 1.6,
    },
    {
      name: 'Bronze Chest',
      image: '15_Bronze-chest.webp',
      category: 'Chest',
      rarityNumber: 74,
      rarityPercentage: 7.4,
    },
    {
      name: 'Diamond Hands With Moon',
      image: '19_Diamond-hands-with-moon.webp',
      category: 'Moon',
      rarityNumber: 25,
      rarityPercentage: 2.5,
    },

    {
      name: 'Visor In Black',
      image: '29_Visor-in-black.webp',
      category: 'Visor',
      rarityNumber: 1,
      rarityPercentage: 0.1,
    },
    {
      name: 'Visor In Gold',
      image: '28_Visor-in-gold.webp',
      category: 'Visor',
      rarityNumber: 5,
      rarityPercentage: 0.5,
    },
    {
      name: 'Visor In Silver',
      image: '27_Visor-in-silver.webp',
      category: 'Visor',
      rarityNumber: 14,
      rarityPercentage: 1.4,
    },
    {
      name: 'Visor In Bronze',
      image: '26_Visor-in-bronze.webp',
      category: 'Visor',
      rarityNumber: 31,
      rarityPercentage: 3.1,
    },
    {
      name: 'Visor In Emerald Green',
      image: '25_Visor-in-emerald-green.webp',
      category: 'Visor',
      rarityNumber: 74,
      rarityPercentage: 7.4,
    },
    {
      name: 'Visor In Ruby Red',
      image: '24_Visor-in-ruby-red.webp',
      category: 'Visor',
      rarityNumber: 99,
      rarityPercentage: 9.9,
    },
    {
      name: 'Visor In Pink',
      image: '23_Visor-in-pink.webp',
      category: 'Visor',
      rarityNumber: 124,
      rarityPercentage: 12.4,
    },
    {
      name: 'Visor In Sapphire Blue',
      image: '22_Visor-in-sapphire-blue.webp',
      category: 'Visor',
      rarityNumber: 148,
      rarityPercentage: 14.8,
    },
    {
      name: 'Visor In Purple',
      image: '21_Visor-in-purple.webp',
      category: 'Visor',
      rarityNumber: 201,
      rarityPercentage: 20.1,
    },
    {
      name: 'Visor In White',
      image: '20_Visor-in-white.webp',
      category: 'Visor',
      rarityNumber: 303,
      rarityPercentage: 30.3,
    },

    {
      name: 'Badge Waning Crescent',
      image: '37_Badge-Waning-crescent.webp',
      category: 'Badge',
      rarityNumber: 39,
      rarityPercentage: 3.9,
    },
    {
      name: 'Badge Last Quarter',
      image: '36_Badge-Last-quarter.webp',
      category: 'Badge',
      rarityNumber: 43,
      rarityPercentage: 4.3,
    },
    {
      name: 'Badge Waning Gibbous',
      image: '35_Badge-Waning-gibbous.webp',
      category: 'Badge',
      rarityNumber: 72,
      rarityPercentage: 7.2,
    },
    {
      name: 'Badge Full Moon',
      image: '34_Badge-Full-Moon.webp',
      category: 'Badge',
      rarityNumber: 100,
      rarityPercentage: 10,
    },
    {
      name: 'Badge Waxing Gibbous',
      image: '33_Badge-Waxing-gibbous.webp',
      category: 'Badge',
      rarityNumber: 115,
      rarityPercentage: 11.5,
    },
    {
      name: 'Badge First Quarter',
      image: '32_Badge-First-quarter.webp',
      category: 'Badge',
      rarityNumber: 132,
      rarityPercentage: 13.2,
    },
    {
      name: 'Badge Waxing Crescent',
      image: '31_Badge-Waxing-crescent.webp',
      category: 'Badge',
      rarityNumber: 221,
      rarityPercentage: 22.1,
    },
    {
      name: 'Badge New Moon',
      image: '30_Badge-New-Moon.webp',
      category: 'Badge',
      rarityNumber: 278,
      rarityPercentage: 27.8,
    },

    {
      name: 'Gloves Full Black',
      image: '48_Gloves-full-black.webp',
      category: 'Gloves',
      rarityNumber: 10,
      rarityPercentage: 1,
    },
    {
      name: 'Gloves Gold',
      image: '47_Gloves-gold.webp',
      category: 'Gloves',
      rarityNumber: 5,
      rarityPercentage: 0.5,
    },
    {
      name: 'Gloves Silver',
      image: '46_Gloves-silver.webp',
      category: 'Gloves',
      rarityNumber: 15,
      rarityPercentage: 1.5,
    },
    {
      name: 'Gloves Bronze',
      image: '45_Gloves-bronze.webp',
      category: 'Gloves',
      rarityNumber: 35,
      rarityPercentage: 3.5,
    },
    {
      name: 'Gloves Emerald Green',
      image: '44_Gloves-emerald-green.webp',
      category: 'Gloves',
      rarityNumber: 61,
      rarityPercentage: 6.1,
    },
    {
      name: 'Gloves Ruby Red',
      image: '43_Gloves-ruby-red.webp',
      category: 'Gloves',
      rarityNumber: 93,
      rarityPercentage: 9.3,
    },
    {
      name: 'Gloves Pink',
      image: '42_Gloves-pink.webp',
      category: 'Gloves',
      rarityNumber: 103,
      rarityPercentage: 10.3,
    },
    {
      name: 'Gloves Sapphire Blue',
      image: '40_Gloves-sapphire-blue.webp',
      category: 'Gloves',
      rarityNumber: 125,
      rarityPercentage: 12.5,
    },
    {
      name: 'Gloves Purple',
      image: '39_Gloves-purple.webp',
      category: 'Gloves',
      rarityNumber: 321,
      rarityPercentage: 32.1,
    },
    {
      name: 'Gloves White',
      image: '38_Gloves-white.webp',
      category: 'Gloves',
      rarityNumber: 232,
      rarityPercentage: 23.2,
    },

    {
      name: 'Color Full Black',
      image: '58_Color-full-black.webp',
      category: 'Color',
      rarityNumber: 1,
      rarityPercentage: 0.1,
    },
    {
      name: 'Color Gold',
      image: '55_Color-Gold.webp',
      category: 'Color',
      rarityNumber: 9,
      rarityPercentage: 0.9,
    },
    {
      name: 'Color Silver',
      image: '56_Color-Silver.webp',
      category: 'Color',
      rarityNumber: 15,
      rarityPercentage: 1.5,
    },
    {
      name: 'Color Bronze',
      image: '57_Color-bronze.webp',
      category: 'Color',
      rarityNumber: 25,
      rarityPercentage: 2.5,
    },
    {
      name: 'Color Emerald Green',
      image: '54_Color-Emerald-Green.webp',
      category: 'Color',
      rarityNumber: 73,
      rarityPercentage: 7.3,
    },
    {
      name: 'Color Ruby Red',
      image: '53_Color-Ruby-Red.webp',
      category: 'Color',
      rarityNumber: 99,
      rarityPercentage: 9.9,
    },
    {
      name: 'Color Pink',
      image: '52_Color-Pink.webp',
      category: 'Color',
      rarityNumber: 126,
      rarityPercentage: 12.6,
    },
    {
      name: 'Color Sapphire Blue',
      image: '51_Color-Sapphire-Blue.webp',
      category: 'Color',
      rarityNumber: 151,
      rarityPercentage: 15.1,
    },
    {
      name: 'Color Purple',
      image: '50_Color-Purple.webp',
      category: 'Color',
      rarityNumber: 201,
      rarityPercentage: 20.1,
    },
    {
      name: 'Color White',
      image: '49_Color-White.webp',
      category: 'Color',
      rarityNumber: 300,
      rarityPercentage: 30,
    },
    /* 
        {
          name: 'Black Tier',
          image: '62_Black-tier.webp',
          category: 'Tier',
          rarityNumber: 1,
          rarityPercentage: 0.1,
        },
        {
          name: 'Gold Tier',
          image: '61_Gold-tier.webp',
          category: 'Tier',
          rarityNumber: 5,
          rarityPercentage: 0.5,
        },
        {
          name: 'Silver Tier',
          image: '60_Silver-tier.webp',
          category: 'Tier',
          rarityNumber: 15,
          rarityPercentage: 1.5,
        },
        {
          name: 'Bronze Tier',
          image: '59_Bronze-tier.webp',
          category: 'Tier',
          rarityNumber: 29,
          rarityPercentage: 2.9,
        },
        {
          name: 'Common Tier',
          image: '63_Common-tier.webp',
          category: 'Tier',
          rarityNumber: 950,
          rarityPercentage: 95,
        }, */
  ]

  newList = []

  constructor() { }

  ngOnInit(): void {
  }

  getAvailableCategories(): any {
    let list = {}

    this.items.forEach(value => {
      list[value.category] = list[value.category] || []
      list[value.category].push(value)
    });

    Object.keys(list).forEach(key => {
      let value = list[key];

      value.sort(
        (a: any, b: any) => this.sortFromLowToHigh(a, b)
      );
    })

    return list
  }
  
  sortFromLowToHigh(a: any, b: any) {
    {
      const arp = a.rarityPercentage;
      const brp = b.rarityPercentage;

      return (arp < brp) ? -1 : (arp > brp) ? 1 : 0
    }
  }

  getRareDrops(): any {
    let list = [
      {
        rarity: [20, 100],
        content: []
      },
      {
        rarity: [5, 19.99],
        content: []
      },
      {
        rarity: [1, 4.99],
        content: []
      },
      {
        rarity: [0, 0.99],
        content: []
      }
    ]

    this.items.forEach(value => {

      for (let i = 0; i < this.rarityLevels.length; i++) {
        if (value.rarityPercentage >= this.rarityLevels[i][0]) {
          list[i].content.push(value)
          break;
        }
      }

    });

    list.forEach(value => {
      value.content.sort(
        (a: any, b: any) => this.sortFromLowToHigh(a, b)
      );
    })

    return list
  }

  trackByFn(index, item) {
    return item.title;
  }

}

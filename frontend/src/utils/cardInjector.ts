// src/utils/cardInjector.ts
import { ReactElement } from 'react';

export interface InjectedCard {
  id: string;
  type: 'cta' | 'promotion' | 'support';
  variant?: string; // For A/B testing
  content: ReactElement;
  position?: number; // Optional specific position
  conditions?: {
    minCards?: number;
    maxCards?: number;
    userSegment?: string;
    testGroup?: string;
  };
}

export interface InjectorConfig {
  cards: InjectedCard[];
  strategy: 'fixed' | 'interval' | 'random';
  intervalSize?: number; // For interval strategy
  maxInjections?: number;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = Math.imul(31, hash) + value.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash >>> 0;
}

function createSeededRandom(seed: string) {
  let state = hashString(seed) || 0x1a2b3c4d;

  return () => {
    state += 0x6d2b79f5;
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    const result = (state ^ (state >>> 14)) >>> 0;
    return result / 0x100000000;
  };
}

export class CardInjector {
  private config: InjectorConfig;

  constructor(config: InjectorConfig) {
    this.config = config;
  }
  
  /**
   * Injects promotional cards into the commentary array based on configured strategy
   */
  inject<T>(items: T[], currentTestGroup?: string, seed: string = ''): (T | InjectedCard)[] {
    if (items.length === 0) return items;
    
    // Filter cards based on conditions
    const eligibleCards = this.config.cards.filter(card => {
      const conditions = card.conditions;
      if (!conditions) return true;
      
      if (conditions.minCards && items.length < conditions.minCards) return false;
      if (conditions.maxCards && items.length > conditions.maxCards) return false;
      if (conditions.testGroup && conditions.testGroup !== currentTestGroup) return false;
      
      return true;
    });
    
    if (eligibleCards.length === 0) return items;
    
    const result: (T | InjectedCard)[] = [...items];
    let injectedCount = 0;
    
    switch (this.config.strategy) {
      case 'fixed':
        // Insert at specific positions
        eligibleCards.forEach(card => {
          if (card.position !== undefined && 
              card.position <= result.length && 
              (!this.config.maxInjections || injectedCount < this.config.maxInjections)) {
            result.splice(card.position + injectedCount, 0, card);
            injectedCount++;
          }
        });
        break;
        
      case 'interval':
        // Insert at regular intervals
        const interval = this.config.intervalSize || 3;
        let position = interval - 1; // Start after first interval
        
        while (position < result.length + injectedCount && 
               eligibleCards.length > 0 && 
               (!this.config.maxInjections || injectedCount < this.config.maxInjections)) {
          const card = eligibleCards[injectedCount % eligibleCards.length];
          result.splice(position, 0, card);
          injectedCount++;
          position += interval;
        }
        break;
        
      case 'random': {
        // Insert at pseudo-random positions derived from the provided seed
        const maxInjections = Math.min(
          this.config.maxInjections || eligibleCards.length,
          Math.floor(items.length / 3) // Don't inject more than 1/3 of original content
        );

        const seededRandom = createSeededRandom(`${seed}|${currentTestGroup ?? ''}|${items.length}`);

        for (let i = 0; i < maxInjections && eligibleCards.length > 0; i++) {
          const position = Math.floor(seededRandom() * (result.length + 1));
          const card = eligibleCards[i % eligibleCards.length];
          result.splice(position, 0, card);
          injectedCount++;
        }
        break;
      }
    }
    
    return result;
  }
}

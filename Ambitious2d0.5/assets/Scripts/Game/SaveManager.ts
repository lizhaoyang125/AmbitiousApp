import { sys } from 'cc';
import { GameState } from './GameState';

/**
 * 存档管理器
 */
export class SaveManager {
  private static readonly KEY = 'wmb_save_data';

  /**
   * 保存游戏
   */
  public static save(): void {
    const state = GameState.instance.state;
    const saveData = {
      version: '1.0.0',
      savedAt: Date.now(),
      ...state,
    };
    try {
      sys.localStorage.setItem(this.KEY, JSON.stringify(saveData));
      console.log('Game saved');
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  }

  /**
   * 加载游戏
   */
  public static load(): boolean {
    try {
      const json = sys.localStorage.getItem(this.KEY);
      if (!json) {
        return false;
      }
      GameState.instance.deserialize(json);
      console.log('Game loaded');
      return true;
    } catch (e) {
      console.error('Failed to load game:', e);
      return false;
    }
  }

  /**
   * 清除存档
   */
  public static clear(): void {
    sys.localStorage.removeItem(this.KEY);
    console.log('Save cleared');
  }

  /**
   * 检查是否有存档
   */
  public static hasSave(): boolean {
    return sys.localStorage.getItem(this.KEY) !== null;
  }
}


import {arr} from './pArray'

export interface ITweenOption {
    key?: string;
    duration?: number;
    step?: number;
    log?: boolean;
}

export type TTweenOption = number | ITweenOption;

class pTween {
    private _memory = {};

    protected _opt(opt: TTweenOption): ITweenOption {
            const rkey = `__to_num_${Date.now()}_${Math.random() * 1000 >> 1}`;
            return {
                key: typeof opt == 'number' ? rkey : opt.key || rkey,
                duration: (typeof opt === 'number' ? opt : opt.duration || 1) * 1000,
                step: typeof opt === 'number' ? 16 : opt.step || 16,
                log: typeof opt === 'number' ? true : opt.log || true,
            };
    }

    public stop(id: TFlexData<number>, ...ids: number[]) {
        const { flatter } = arr;

        ids = flatter(id, ...ids);
        ids.forEach( i => {
            if(i && this._memory[i]) {
            }
        } )
    }
}

export const tween = new pTween();

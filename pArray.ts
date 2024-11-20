
export const arr = {
    flatter: function<T>(target?: TFlexData<T>, ...targets: T[]): T[] {
        if(target === undefined && targets.length <= 0) return[]
        //@ts-ignore
        return [target, ...targets].flat();
    }
}


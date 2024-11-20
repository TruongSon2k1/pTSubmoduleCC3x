import { arr } from './pArray'
import { ccx } from './pCC'

export const obj = {
    copy_exclude_keys: function<T, K extends keyof T>(source: T, key: TFlexData<K>, ...keys: K[]): Exclude<T, K> {
        const { flatter } = arr;

        keys = flatter(key, ...keys);
        const { ...result } = source;

        keys.forEach(k => delete result[k]);

        return result as Exclude<T, K>
    },

    copy_functions: function<T>(_this: TClassConstructor<T>, _source: TFlexData<TClassConstructor<any>>, ..._sources: TClassConstructor<any>[]) {
        const { flatter } = arr;
        const { property_exceptions } = ccx;

        _sources = flatter(_source, ..._sources);
        const _tproto = _this.prototype;

        for(const source of _sources) {
            const _sproto = source.prototype;

            Object.getOwnPropertyNames(_sproto).forEach( property => {
                if(property_exceptions.has(property)) return;
                if(property in _tproto) return;

                const sdescriptor = Object.getOwnPropertyDescriptor(_sproto, property);
                if(!sdescriptor) return;

                const tdescriptor = Object.getOwnPropertyDescriptor(_tproto, property);

                const { value, get, set, enumerable, configurable } = sdescriptor;

                if(typeof sdescriptor.value === 'function') {
                    if(!!tdescriptor && tdescriptor.value != undefined) return;
                    _tproto[property] = value;
                } else if (get || set) {
                    Object.defineProperty(_tproto, property, {
                        get: tdescriptor.get || (get ? get.bind(_tproto) : undefined),
                        set: tdescriptor.set || (set ? set.bind(_tproto) : undefined),
                        enumerable: tdescriptor.enumerable || enumerable,
                        configurable: tdescriptor.configurable || configurable
                    })
                }
            })
        }
    }
}

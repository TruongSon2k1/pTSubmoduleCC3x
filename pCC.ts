import { arr } from './pArray'
import { obj } from './pObject'
import * as cc from 'cc'

const cc_attrs_list = [
    'default', 'ctor', 'hasGetter', 'hasSetter', 'serializable',
    'type', 'visible', 'displayName', 'displayOrder', 'tooltip',
    'group', 'multiline', 'readonly', 'min', 'max', 'step', 'range',
    'slide', 'serializable', 'formerlySerializedAs', 'editorOnly',
    'override', 'animatable', 'unit', 'radian', 'userData', 'radioGroup',
    'enumList'
] as const;

type TCCAttributeList = typeof cc_attrs_list[number];
type TCCAttribute = Partial<Record<TCCAttributeList, any>>;

type TCCAttributeType<T> = '' | 'Object' | 'Enum' | TClassConstructor<T> | T;
interface ICCAttributeGroup {
    id?: string;
    name?: string;
    displayOrder?: number;
    style?: string;
}
type TCCAttributeGroup = string | ICCAttributeGroup;
interface ICCAttributeReadonly {
    deep?: boolean;
}
type TCCAttributeReadonly = boolean | ICCAttributeReadonly;
type TCCAttributeMinMax = number | (() => number);
interface IAttributeEnum {
    name: string;
    value: string | number
}

interface ICCAttribute<T = any> {
    default?: any;
    ctor: TClassConstructor<T>;
    hasGetter?: boolean;
    hasSetter?: boolean;
    serializable?: boolean;
    type?: TCCAttributeType<T>;
    visible?: boolean;
    displayName?: string;
    displayOrder?: string;
    tooltip?: string;
    group?: TCCAttributeGroup;
    multiline?: boolean;
    readonly?: TCCAttributeReadonly;
    min?: TCCAttributeMinMax;
    max?: TCCAttributeMinMax;
    step?: number;
    range?: number[];
    slide?: boolean;
    formerlySerializedAs?: string;
    editorOnly?: boolean;
    override?: boolean;
    animatable?: boolean;
    unit?: string;
    radian?: boolean;
    userData?: Record<string, any>;
    radioGroup?: boolean;
    enumList?: IAttributeEnum[];
}

type TCCAttributes<T = any> = Record<string, ICCAttribute<T>>
export const ccx = {
    property_exceptions: new Set([ '__classname__', '__cid__', 'constructor' ]),
    component_props_exceptions: ['_name', '_objFlags', '__scriptAsset', 'node', '_enabled', '__prefab', '__editorExtras__'],

    attrs_getter: function<T>(_prototype: TClassConstructor<T>): object {
        const prototype = _prototype.prototype || _prototype;
        const constructor = prototype.constructor || prototype;

        return constructor['__attrs__']

    },

    props_getter: function<T>(_prototype: TClassConstructor<T>): string[] {
        const prototype = _prototype.prototype || _prototype;
        const constructor = prototype.constructor || prototype;

        return constructor['__props__'];
    },

    attrs_list: cc_attrs_list,

    _attribute: function(_attr: object, _property: string): TCCAttribute {
        const data = {};

        ccx.attrs_list.forEach( k => {
            const key = `${_property}$_$${k}`;
            if(_attr[key] !== undefined) data[k] = _attr[key];
        } )

        return data;
    },

    attribute: function<T>(_prototype: TClassConstructor<T>, _property: string) {
        const { attrs_getter, _attribute } = ccx;

        const attrs = attrs_getter(_prototype);
        if(!attrs) return {};

        return _attribute(attrs, _property);
    },

    attributes: function<T>(_prototype: TClassConstructor<T>, exception?: TFlexData<string>, ...exceptions: string[]): TCCAttributes<T> {

        const { attrs_getter, _attribute, props_getter, is_ccclass } = ccx;
        const { flatter } = arr;

        if(is_ccclass(_prototype)) {
            const sexceptions = new Set(flatter(exception, ...exceptions));
            const attrs = attrs_getter(_prototype);
            const props = (sexceptions.size > 0) ? props_getter(_prototype).filter( e => !sexceptions.has(e) ) : props_getter(_prototype);

            const data = {};

            for(const prop of props) data[prop] = _attribute(attrs, prop);

            return data;
        } else {
            console.log(_prototype)
            return _prototype.constructor['__ccclassCache__'].proto.properties;
        }
    },

    is_ccclass: function<T>(target: TClassConstructor<T>) {
        return target['__classname__'] !== undefined;
    },

    reflect_attrs_from_ccclass: function<T extends object>(_this_prototype: TClassConstructor<T>, _target_attrs: TCCAttributes<T>, _this_attrs?: TCCAttributes<T>) {
        const { copy_exclude_keys } = obj;
        _this_attrs = _this_attrs || ccx.attributes(_this_prototype);

        Object.entries(_target_attrs).forEach( ([key, value]) => {
            if(_this_attrs[key] !== undefined) return;

            const { type, enumList, ctor } = value;

            const data: PropertyDescriptor = {
                writable: true,
                configurable: true,
                enumerable: true,
                value: (value.default != undefined) ? (typeof value.default === 'function' ? value.default() : value.default) : null
            }

            Reflect.defineProperty(_this_prototype, key, data);
            const cvalue = copy_exclude_keys(value, 'default');

            if(cvalue.hasGetter && !cvalue.hasSetter) cvalue.readonly = true;
            if(type === 'Object') cvalue.type = ctor;
            else if(type === 'Enum') {
                const edata = Object.fromEntries( enumList.map(ret => [ret.name, ret.value]) )
                cvalue.type = cc.Enum<any>(edata);
            }
            //@ts-ignore
            cc._decorator.property(cvalue)(_this_prototype, key);
        })
    }
}

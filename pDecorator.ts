import { obj } from "./pObject";
import { ccx } from "./pCC";
import * as cc from 'cc'

function _mixins(_this: Function, _classes: TClassConstructor<any>[]) {
    if(_classes === undefined) return;

    const { attributes, reflect_attrs_from_ccclass, component_props_exceptions } = ccx;
    const { copy_functions } = obj;

    _classes.forEach( _class => {
        const { prototype } = _class;
        const attrs = attributes<any>(prototype, ( prototype instanceof cc.Component ? component_props_exceptions : []))
        reflect_attrs_from_ccclass<any>(_this.prototype, attrs);
        copy_functions(_this as TClassConstructor<any>, _class);
        _mixins(_this, _class['__mixins__']);
    })
}


export const decor = {
    mixins: function(..._classes: TClassConstructor<any>[]): ClassDecorator {
        return function(_this: Function): void {
            _mixins(_this, _classes);
            _this['__mixins__']= _classes;
        }
    }
}

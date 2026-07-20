import { _decorator, Component, Node, Label, Sprite, Color, Toggle } from 'cc';

const { ccclass, property } = _decorator;

export interface IOptionCardData {
    id: string;
    icon: string;
    name: string;
    desc: string;
    selected: boolean;
}

@ccclass('OptionCard')
export class OptionCard extends Component {

    @property(Label)
    iconLabel: Label = null;

    @property(Label)
    nameLabel: Label = null;

    @property(Label)
    descLabel: Label = null;

    @property(Sprite)
    background: Sprite = null;

    @property(Toggle)
    toggle: Toggle = null;

    private _data: IOptionCardData | null = null;
    private _onSelect: ((id: string) => void) | null = null;

    /**
     * 初始化卡片
     */
    public init(data: IOptionCardData, onSelect: (id: string) => void) {
        this._data = data;
        this._onSelect = onSelect;

        if (this.iconLabel) this.iconLabel.string = data.icon;
        if (this.nameLabel) this.nameLabel.string = data.name;
        if (this.descLabel) this.descLabel.string = data.desc;

        this.updateSelected(data.selected);

        if (this.toggle) {
            this.toggle.node.on(Toggle.EventType.TOGGLE, this.onToggle, this);
        }
    }

    /**
     * 更新选中状态
     */
    public updateSelected(selected: boolean) {
        if (this._data) {
            this._data.selected = selected;
        }
        if (this.background) {
            this.background.color = selected
                ? new Color(100, 200, 100, 255)
                : new Color(240, 240, 240, 255);
        }
        if (this.toggle) {
            this.toggle.isChecked = selected;
        }
    }

    private onToggle(toggle: Toggle) {
        if (this._data && this._onSelect && toggle.isChecked) {
            this._onSelect(this._data.id);
        }
    }

    onDestroy() {
        if (this.toggle) {
            this.toggle.node.off(Toggle.EventType.TOGGLE, this.onToggle, this);
        }
    }
}

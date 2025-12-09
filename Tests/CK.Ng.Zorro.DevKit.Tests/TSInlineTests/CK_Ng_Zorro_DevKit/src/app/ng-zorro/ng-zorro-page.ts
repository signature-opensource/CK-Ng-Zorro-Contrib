import {Component, inject, TemplateRef, ViewChild} from '@angular/core';
import {NzButtonModule, NzButtonSize} from 'ng-zorro-antd/button';
import {NzIconModule, provideNzIconsPatch} from 'ng-zorro-antd/icon';
import {
  DownloadOutline,
  DownOutline,
  EllipsisOutline,
  LinkOutline,
  SearchOutline, SmileOutline, UserOutline
} from '@ant-design/icons-angular/icons';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {FormsModule} from '@angular/forms';
import {NzDropDownModule, NzPlacementType} from 'ng-zorro-antd/dropdown';
import {NzCheckboxModule, NzCheckboxOption} from 'ng-zorro-antd/checkbox';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzDescriptionsModule, NzDescriptionsSize} from 'ng-zorro-antd/descriptions';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzFlexModule} from 'ng-zorro-antd/flex';
import {NzConfigService} from 'ng-zorro-antd/core/config';
import {NzCascaderModule} from 'ng-zorro-antd/cascader';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTransferModule} from 'ng-zorro-antd/transfer';
import {NzTreeSelectModule} from 'ng-zorro-antd/tree-select';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzAlertComponent} from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-ng-antd',
  imports: [
    FormsModule,
    NzBadgeModule,
    NzButtonModule,
    NzCascaderModule,
    NzCheckboxModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzDropDownModule,
    NzFlexModule,
    NzIconModule,
    NzInputModule,
    NzListModule,
    NzRadioModule,
    NzSelectModule,
    NzSpaceModule,
    NzSwitchModule,
    NzTableModule,
    NzTransferModule,
    NzTreeSelectModule,
    NzAlertComponent
  ],
  providers: [
    provideNzIconsPatch([
      LinkOutline,
      DownloadOutline,
      SearchOutline,
      DownOutline,
      EllipsisOutline,
      UserOutline,
      SmileOutline
    ])
  ],
  templateUrl: './ng-zorro-page.html',
  styleUrl: './ng-zorro-page.less',
  host: { class: 'ck-p-x-m ck-p-y-m' }
})
export class NgZorroPage {
  // Buttons
  protected buttonSize: NzButtonSize = 'default';

  // Checkbox
  protected isCheckedButton = false;
  protected isDisabledButton = false;
  protected checkButton(): void { this.isCheckedButton = !this.isCheckedButton; }
  protected disableButton(): void { this.isDisabledButton = !this.isDisabledButton; }
  protected isAllCheckedFirstChange = true;
  protected allChecked = false;
  protected value : Array<string | number> = ['Apple', 'Orange'];
  protected options: NzCheckboxOption[] = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' }
  ];
  protected updateAllChecked(): void {
    if (!this.isAllCheckedFirstChange) {
      this.value = this.allChecked ? this.options.map(item => item.value) : [];
    }
    this.isAllCheckedFirstChange = false;
  }
  protected updateSingleChecked(): void { this.allChecked = this.value.length === this.options.length; }

  // Description
  protected descriptionSize: NzDescriptionsSize = 'default';

  // Dropdown
  protected listOfPosition: NzPlacementType[] = ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'];

  // Empty
  #nzConfigService = inject(NzConfigService);
  @ViewChild('customTpl', { static: false }) protected customTpl?: TemplateRef<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  protected customize = false;
  protected onConfigChange(): void {
    if (this.customize) {
      this.#nzConfigService.set('empty', { nzDefaultEmptyContent: this.customTpl });
    } else {
      this.#nzConfigService.set('empty', { nzDefaultEmptyContent: undefined });
    }
  }

  // Radio
  protected radioValue = 'A';
  protected isRadioDisabled = true;
}

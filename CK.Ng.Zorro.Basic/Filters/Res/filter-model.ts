export enum FilterType {
  SELECT,
  SWITCH,
  DATE_RANGE,
}

export interface Filter<T> {
  filterType: FilterType;
  label: string;
  value: T | Array<T> | undefined;
  active: boolean;
  placeholder?: string | [string, string];
}

export class SwitchFilter implements Filter<boolean> {
  filterType: FilterType;
  label: string;
  value: boolean;
  active: boolean;
  placeholder?: string;

  constructor(
    label: string,
    defaultValue: boolean,
    active: boolean,
    placeholder?: string
  ) {
    this.filterType = FilterType.SWITCH;
    this.label = label;
    this.value = defaultValue;
    this.active = active;
    this.placeholder = placeholder;
  }
}

export class SelectFilter<T> implements Filter<T> {
  filterType: FilterType = FilterType.SELECT;
  label: string;
  mode: 'default' | 'multiple' | 'tags';
  options: Array<{ label: string; value: T }>;
  value: T | Array<T> | undefined;
  active: boolean;
  defaultValue?: T | Array<T>;
  placeholder?: string;
  maxSelectionCount: number;

  constructor(
    mode: 'default' | 'multiple' | 'tags',
    label: string,
    options: Array<{ label: string; value: T }>,
    {
      defaultValue,
      active,
      placeholder,
      maxSelectionCount
    }: Partial<Omit<SelectFilter<T>, 'mode' | 'label' | 'options'>> = {} ) {
    this.mode = mode;
    this.label = label;
    this.options = options;
    this.defaultValue = defaultValue;
    this.active = active ?? true;
    this.value = defaultValue;
    this.placeholder = placeholder;
    this.maxSelectionCount = maxSelectionCount ?? options.length;
  }
}

export class DateRangeFilter implements Filter<Date> {
  filterType: FilterType = FilterType.DATE_RANGE;
  label: string;
  value: [Date, Date] | undefined;
  active: boolean;
  placeholder?: [string, string];
  format: string;
  showTime: boolean;
  presets?: { [label: string]: Date[] | ( () => Date[] ) };

  constructor(
    label: string,
    {
      active,
      placeholder,
      format,
      showTime,
      presets
    }: Partial<Omit<DateRangeFilter, 'filterType' | 'label' | 'value'>> = {} ) {
    this.label = label;
    this.active = active ?? true;
    this.format = format ?? 'dd/MM/yyyy';
    this.showTime = showTime ?? false;
    this.presets = presets;
    this.placeholder = placeholder;
  }
}

# CK.Ng.Zorro.Basic - known issues

Defects found in this package while writing its README. They are listed here
rather than in the README because they are problems to fix, not behaviour to rely on.

## The table component

Selection is by reference: `isSelected` uses `Array.includes`. Rebuilding the row objects - mapping a
fresh array from the server - drops the selection.

Selection is also cleared wholesale when the visible page changes. Paging, sorting or filtering calls
`onCurrentPageDataChange`, which clears everything and emits `selectionChanged([])` rather than
keeping the rows that are still visible.

`hasSelectedItems()` is not what its name says. It returns true only when *some but not all* rows of
the page are selected - it is the indeterminate state of the header checkbox. Select every row and it
returns false.

Three methods write `hidden` onto the `TableColumn` objects you passed in: `updateColumnsChecked`,
and `activateAllColumns` and `clearColumns` behind the two popover buttons. Share one column array
across two pages and hiding a column in one hides it in the other. Only the first of the three emits
`columnsChanged`, so a listener persisting column state misses both buttons.

`searchbarDebounceTime` is read once, in the constructor, before inputs are set. Binding it has no
effect; the debouncer always uses its default. `ListView` builds its own debouncer the same way, from
an input of the same name, so `AdaptivePageLayout` forwarding the value to both children is inert on
both paths.

`defineIcon` on a column does nothing at all. No template calls `getIconValue` or `hasIconValue`, and
`getIconValue` has its only call commented out and returns `faQuestion` regardless.
`iconShouldReplaceValue` is never read either.

`showPageSizeOptions` is declared with a default of `true` and nothing reads it: the template
hard-codes `[nzShowSizeChanger]="true"`, so binding it to `false` still shows the page-size selector.

`TableColumn.sortDirections` is dead too, and more simply than `defineIcon`: it has no reader at all.
`DefaultTableColumn` accepts it and stores it, the sortable header binds `[nzSortOrder]` and
`[nzSortFn]` but no `[nzSortDirections]`, and that name appears nowhere in the repository.

## The other components

`AdaptivePageLayout` reads three of its optional function inputs without the parentheses that would
read the signal:

```ts
this.displayedItems.set( this.searchFunc ? this.searchFunc()!( input ) : this.items() );
```

The test is on `this.searchFunc`, the signal object itself, which is always truthy - so the
`this.items()` fallback is dead code. The call that follows does read the signal, and gets `undefined`
when the host bound nothing, which the `!` hides from the compiler. Leave `searchFunc` unbound and,
under the default front pagination, the component throws instead of falling back to the unfiltered
list - one debounce interval after the user types, since the search bar reaches `search()` through the
debouncer rather than directly. `filterFunc` and `filterByRadioFunc` are written the same way, in
`filterData()` and `updateRadioFilterValue()`. Neither sits behind the debouncer - of the three reads,
only the `searchFunc` one is - so under the same front pagination both throw on the gesture itself:
changing a chip's value, ticking or unticking a filter in the layout's filter popover, clicking that
popover's *Activate all* or *Deactivate all*, or picking a value in the filter radio group. Two
lookalikes on the same screen do not throw: the table's column popover carries its own pair of
buttons, captioned from `CK.Table.Button.ActivateAll`/`DeactivateAll` - the same words as the
layout's in the default locale, different ones in French - and the layout renders a second radio
group beside the first whose change is only emitted.

`AdaptivePageLayout` never hands its action bar the selection. It tracks one - `selectedItems` is set
from the table's `selectionChanged` - and reads it nowhere, least of all in
`<ck-action-bar [actions]="actions()!" />`, which binds no `[selectedItems]`. So every action's
callbacks receive `ActionBar`'s default empty array: one declared to appear only on a selection never
appears, one declared to disable on an empty selection is always disabled, and one that does appear
runs on nothing. `LayoutContent`, in `CK.Ng.Zorro.BackOffice`, binds the input from one of its own,
so this is an omission here rather than a shape of `ActionBar`.

`SplitView`'s `breakpoint` input is declared and never used: the breakpoint lives in the component's
LESS as a media query. Setting it changes nothing. The component also lists `ResponsiveDirective` in
its `imports` and never applies it - `split-view.html` is eight lines and uses only `[style.width]`,
`[style.min-width]` and `[class.visible]`.

`SplitView` ships no close control of its own, and its close event is on the path nobody takes. A
host closes the pane by setting `detailVisible` false through its two-way binding, and that route
emits nothing. `detailClosed` has one emitter, `closeDetail()`, which the package never calls and no
template control reaches, so a host that binds `(detailClosed)` hears nothing unless it calls the
method itself: `<ck-split-view #sv>`, then `sv.closeDetail()` from its own projected content. The
demo is that host: it binds `(detailClosed)`, opens the pane through the model, and has no way to
close it at all.

`Loader` is absolutely positioned at the full size of its nearest positioned ancestor. Without a
`position: relative` container it escapes to the viewport.

Six declared LESS variables are never read, across three components. `AdaptivePageLayout` declares
five and three are dead: `@ck-adaptive-page-layout-padding`, `-border` and `-bg-color`. Its stylesheet
does set padding and a border radius elsewhere, from literals and from the theme's
`@ck-border-radius`, and sets no background at all. `ListView` declares
`@ck-list-view-searchbar-height` and its search bar sets no height, where `Table`'s twin rule sets one
from its own variable. `SimpleInfoBox` declares `@ck-simple-info-box-value-fontweight` and
`@ck-simple-info-box-value-icon-fontsize`.

Two of the six are built on a theme variable, so they look like a theming hook and are not one:
`@ck-adaptive-page-layout-bg-color` on `@white`, and `@ck-simple-info-box-value-fontweight` on
`@font-weight-bold` - that stylesheet hard-codes `font-weight: 600` instead, so overriding the
theme's bold weight moves nothing there.

`ListView` does not filter its own list: it emits `searchRequested` and expects the parent to feed
`[items]` back.

`ListView` declares `dblClickFunc` and never reads it. Its template calls `doubleClick()`, whose
whole body is `this.dblClicked.emit( item )`; `AdaptivePageLayout` listens to that output and calls
its *own* `dblClickFunc`, which is read. Binding the list view's directly does nothing.

`ListView`'s debounce spinner never renders. Its template writes
`<span nz-icon nzType="loading" nzTheme="outline"></span>`, but the component's `imports` does not
include `NzIconModule`, and nothing else in that array exports the icon directive.
`Table` imports it for the same element. `nz-icon` is a plain attribute on a `span`, so nothing
errors; the element just stays empty.

`GenericForm` listens on `document:keydown.enter` and calls `preventDefault()`. Any unmodified Enter
anywhere in the document submits it while it is alive, and two instances mounted at once both fire.
Angular matches the modifiers too, so `Shift+Enter` does not reach the handler and a plain Enter
does. The form renders no textarea of its own - `FormControlType` is text, number, date, password,
select or checkbox - so the case that bites is a textarea the host renders elsewhere on the page. The
`preventDefault()` reaches further than the submit does: while a `GenericForm` is alive, Enter stops
inserting its newline in that textarea, stops activating a focused button or link, and stops
submitting any other form on the page.

`GenericForm` declares `formGroup` and never reads it. The component always builds its own, with
`this.form.set( this.createFormGroup() )` - in the constructor when `NZ_MODAL_DATA` resolves to
something, in an effect otherwise, the two branches testing that same injected value and never both
running. The `[formGroup]` in its template is Angular's directive bound to that signal, not to the
input. The branch tests an injected value, not the host: ng-zorro builds an injector carrying
`NZ_MODAL_DATA` only when the modal's content is a component class, fills it with the raw `nzData`,
and that injector becomes the root injector of the content component's view - so a
`<ck-generic-form>` written anywhere in its template resolves the token too. But the branch is a bare
`if ( this.#modalData )`, and that cannot tell an absent token from a present one holding `undefined`
- `inject` returns `null` for the first and `undefined` for the second, and both are falsy. A modal
opened without `nzData` therefore takes the same branch as no modal at all, though the component is
not otherwise fooled: `NzModalRef` is provided in that same injector, so the Enter handler still
routes to `triggerOk()` rather than emitting `submitRequested`. The constructor branch therefore runs
for one case only: a form inside a component-content modal opened with a *truthy* `nzData`. There its
`[inputFormData]` binding is ignored, and `createFormGroup` throws if that `nzData` has no
`formData`. Everything else, template-content modals included, takes the effect branch and binds
`inputFormData` normally.

That effect reads `inputFormData()` inside its branch, so it tracks it: every new description object
rebuilds the `FormGroup`, seeding each control from its `defaultValue` and discarding whatever the
user had typed.

`GenericForm.submitForm( _: Event )` is called from nowhere. Its `<form nz-form>` declares no
`(ngSubmit)` and the name appears nowhere else in the repository, so the component itself submits
only through the Enter listener above. A modal host still has its own path, the footer's OK button
reaching `nzOnOk` without passing through the component at all.

`GenericForm` drops three members of its own control description. `selectMode` is stored with a
`?? 'default'` and never reaches a `nzMode` binding, so a control declared `'multiple'` or `'tags'`
renders as a single select. `FormControlConfig.value` is assigned from `defaultValue` in the
constructor and read nowhere. And an option's own `disabled` flag never reaches `nzDisabled` - only
the control-level `disabled` is honoured, in the `FormControl` it builds.

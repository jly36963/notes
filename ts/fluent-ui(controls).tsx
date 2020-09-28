// ---------
// controls
// ---------

// ---
// inputs 
// ---

// button
// checkbox
// combobox
// dropdown
// label
// link
// rating
// searchbox
// slider
// spinbutton
// textfield
// toggle

// ---
// galleries & pickers 
// ---

// calendar
// colorpicker
// datepicker
// peoplepicker
// pickers
// swatchcolorpicker

// ---
// items & lists 
// ---

// activityitem
// detailslist
// documentcard
// facepile
// groupedlist
// hovercard
// basiclist
// persona

// ---
// commands, menus, navs
// ---

// breadcrumb
// commandbar
// contextual menu
// nav
// overflowset
// pivot

// ---
// notification & engagement 
// ---

// coarchmark
// messagebar
// teachingbubble

// ---
// progress 
// ---

// progress indicator
// shimmer
// spinner

// ---
// surfaces 
// ---

// callout
// dialog
// modal
// panel
// scrollablepane
// tooltip

// ---
// utilities 
// ---

// announced
// focustrapzone
// focuszone
// icon
// image
// keytips
// layer
// marqueeselection
// overlay
// resizegroup
// selection
// separator
// stack
// text
// themes


// ---------
// buttons
// ---------

// ---
// basic buttons
// ---

import React from "react";
import {
  DefaultButton,
  PrimaryButton,
  Stack,
  IStackTokens,
} from "office-ui-fabric-react";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

const stackTokens: IStackTokens = { childrenGap: 40 };

export const ButtonDefaultExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;

  return (
    <Stack horizontal tokens={stackTokens}>
      <DefaultButton
        text="Standard" // text child
        onClick={handleClick} // onClick handler
        allowDisabledFocus
        disabled={disabled}
        checked={checked}
      />
      <PrimaryButton
        text="Primary"
        onClick={handleClick}
        allowDisabledFocus
        disabled={disabled}
        checked={checked}
      />
    </Stack>
  );
};

const handleClick = (): void => {
  console.log("Clicked");
};

// ---
// compound button
// ---

import * as React from "react";
import { CompoundButton, Stack, IStackTokens } from "office-ui-fabric-react";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

const stackTokens: IStackTokens = { childrenGap: 40 };

export const ButtonCompoundExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;
  return (
    <Stack horizontal tokens={stackTokens}>
      <CompoundButton
        text="Standard"
        secondaryText="This is the secondary text."
        disabled={disabled}
        checked={checked}
        onClick={() => console.log("hello!")}
      />

      <CompoundButton
        primary
        text="Primary"
        secondaryText="This is the secondary text."
        disabled={disabled}
        checked={checked}
        onClick={() => console.log("hello!")}
      />
    </Stack>
  );
};

// ---
// command bar button
// ---

import * as React from "react";
import {
  CommandBarButton,
  IContextualMenuProps,
  IIconProps,
  Stack,
  IStackStyles,
} from "office-ui-fabric-react";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: "emailMessage",
      text: "Email message",
      iconProps: { iconName: "Mail" },
    },
    {
      key: "calendarEvent",
      text: "Calendar event",
      iconProps: { iconName: "Calendar" },
    },
  ],
};

const addIcon: IIconProps = { iconName: "Add" };
const mailIcon: IIconProps = { iconName: "Mail" };
const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };

export const ButtonCommandBarExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;

  // Here we use a Stack to simulate a command bar.
  // The real CommandBar control also uses CommandBarButtons internally.
  return (
    <Stack horizontal styles={stackStyles}>
      <CommandBarButton
        iconProps={addIcon}
        text="New item"
        // split={true} // render split button instead of button/menu
        menuProps={menuProps}
        disabled={disabled}
        checked={checked}
      />
      <CommandBarButton
        iconProps={mailIcon}
        text="Send mail"
        disabled={disabled}
        checked={checked}
      />
    </Stack>
  );
};

// ---
// split button (main action & menu)
// ---

import * as React from "react";
import {
  DefaultButton,
  IContextualMenuProps,
  Stack,
  IStackTokens,
} from "office-ui-fabric-react";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: "emailMessage",
      text: "Email message",
      iconProps: { iconName: "Mail" },
    },
    {
      key: "calendarEvent",
      text: "Calendar event",
      iconProps: { iconName: "Calendar" },
    },
  ],
};

const stackTokens: IStackTokens = { childrenGap: 40 };

export const ButtonSplitExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;

  return (
    <Stack horizontal wrap tokens={stackTokens}>
      <DefaultButton
        text="Standard"
        split
        splitButtonAriaLabel="See 2 options"
        aria-roledescription="split button"
        menuProps={menuProps}
        onClick={handleClicked}
        disabled={disabled}
        checked={checked}
      />
      <DefaultButton
        text="Primary"
        primary
        split
        splitButtonAriaLabel="See 2 options"
        aria-roledescription="split button"
        menuProps={menuProps}
        onClick={handleClicked}
        disabled={disabled}
        checked={checked}
      />
      <DefaultButton
        text="Main action disabled"
        primaryDisabled // main action disabled, menu still usable
        split
        splitButtonAriaLabel="See 2 options"
        aria-roledescription="split button"
        menuProps={menuProps}
        onClick={handleClicked}
        disabled={disabled}
        checked={checked}
      />
      <DefaultButton
        text="Disabled"
        disabled // button and menu disabled
        allowDisabledFocus
        split
        splitButtonAriaLabel="See 2 options"
        aria-roledescription="split button"
        menuProps={menuProps}
        onClick={handleClicked}
        checked={checked}
      />
    </Stack>
  );
};

function handleClicked() {
  console.log("Hello!");
}

// ---
// icon button
// ---

import * as React from "react";
import {
  IconButton,
  IIconProps,
  IContextualMenuProps,
  Stack,
  Link,
} from "office-ui-fabric-react";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

const emojiIcon: IIconProps = { iconName: "Emoji2" };

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: "emailMessage",
      text: "Email message",
      iconProps: { iconName: "Mail" },
    },
    {
      key: "calendarEvent",
      text: "Calendar event",
      iconProps: { iconName: "Calendar" },
    },
  ],
  directionalHintFixed: true,
};

export const ButtonIconExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;

  return (
    <div>
      <Stack tokens={{ childrenGap: 8 }} horizontal>
        <IconButton
          iconProps={emojiIcon}
          title="Emoji"
          ariaLabel="Emoji"
          disabled={disabled}
          checked={checked}
        />
        <IconButton
          menuProps={menuProps} // menu
          iconProps={emojiIcon}
          title="Emoji"
          ariaLabel="Emoji"
          disabled={disabled}
          checked={checked}
        />
      </Stack>
      <p>
        For a list of Icons, visit our{" "}
        <Link href="https://developer.microsoft.com/en-us/fluentui#/styles/icons">
          Icon documentation
        </Link>
        .
      </p>
    </div>
  );
};

// ---
// icon button (tooltip)
// ---

import * as React from "react";
import {
  IconButton,
  IIconProps,
  initializeIcons,
} from "office-ui-fabric-react";
import {
  TooltipHost,
  ITooltipHostStyles,
} from "office-ui-fabric-react/lib/Tooltip";
import { useId } from "@uifabric/react-hooks";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

initializeIcons(); // Initialize icons in case this example uses them

const emojiIcon: IIconProps = { iconName: "Emoji2" };

const calloutProps = { gapSpace: 0 };
// The TooltipHost root uses display: inline by default. override if sizing/positioning issues
const hostStyles: Partial<ITooltipHostStyles> = {
  root: { display: "inline-block" },
};

export const ButtonIconWithTooltipExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const tooltipId = useId("tooltip"); // useId -- ensure that ID is unique on page

  const { disabled, checked } = props;

  return (
    <div>
      <TooltipHost
        content="Emoji"
        // This id is used on the tooltip itself, not the host
        // (so an element with this id only exists when the tooltip is shown)
        id={tooltipId}
        calloutProps={calloutProps}
        styles={hostStyles}
      >
        <IconButton
          iconProps={emojiIcon}
          title="Emoji"
          ariaLabel="Emoji"
          disabled={disabled}
          checked={checked}
        />
      </TooltipHost>
      <p>
        For now, we advise you to take this approach of wrapping IconButton with
        a Tooltip. We'll address providing this behavior out of the box in next
        version of this component in Fluent.
      </p>
    </div>
  );
};

// ---
// contextual menu button
// ---

import * as React from "react";
import {
  ContextualMenu,
  DefaultButton,
  IContextualMenuProps,
  IIconProps,
} from "office-ui-fabric-react";

export interface IButtonExampleProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  disabled?: boolean;
  checked?: boolean;
}

const menuProps: IContextualMenuProps = {
  onDismiss: (e) => {
    if (e && e.shiftKey) {
      e.preventDefault(); // disable dismiss if 'shift' key is held down
    }
  },
  items: [
    {
      key: "emailMessage",
      text: "Email message",
      iconProps: { iconName: "Mail" },
    },
    {
      key: "calendarEvent",
      text: "Calendar event",
      iconProps: { iconName: "Calendar" },
    },
  ],
  directionalHintFixed: true,
};
const addIcon: IIconProps = { iconName: "Add" };

export const ButtonContextualMenuExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;

  return (
    <DefaultButton
      text="New item"
      iconProps={addIcon}
      menuProps={menuProps}
      menuAs={_getMenu} // callback -- customize menu rendering
      onMenuClick={_onMenuClick} // callback -- additional actions (besides menu open)
      // persistMenu={true} // persist instead of create/destroy on open/close
      allowDisabledFocus
      disabled={disabled}
      checked={checked}
    />
  );
};

function _getMenu(props: IContextualMenuProps): JSX.Element {
  return <ContextualMenu {...props} />;
}

function _onMenuClick(e?: React.SyntheticEvent<any>) {
  console.log(e);
}

// ---
// action button
// ---

import * as React from "react";
import { ActionButton, IIconProps } from "office-ui-fabric-react";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

const addFriendIcon: IIconProps = { iconName: "AddFriend" };

export const ButtonActionExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;

  return (
    <ActionButton
      text="Create account"
      iconProps={addFriendIcon}
      allowDisabledFocus
      disabled={disabled}
      checked={checked}
    />
  );
};

// ---
// command button
// ---

import * as React from "react";
import {
  CommandButton,
  IContextualMenuProps,
  IIconProps,
} from "office-ui-fabric-react";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

const menuProps: IContextualMenuProps = {
  items: [
    {
      key: "emailMessage",
      text: "Email message",
      iconProps: { iconName: "Mail" },
    },
    {
      key: "calendarEvent",
      text: "Calendar event",
      iconProps: { iconName: "Calendar" },
    },
  ],
  // shouldFocusOnMount: false // prevent menu from focusing on open
};

const addIcon: IIconProps = { iconName: "Add" };

export const ButtonCommandExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;

  return (
    <CommandButton
      iconProps={addIcon}
      text="New item"
      menuProps={menuProps}
      disabled={disabled}
      checked={checked}
    />
  );
};

// ---
// button like anchor (link)
// ---

import * as React from "react";
import { DefaultButton } from "office-ui-fabric-react";

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

export const ButtonAnchorExample: React.FunctionComponent<IButtonExampleProps> = (
  props
) => {
  const { disabled, checked } = props;

  return (
    <DefaultButton
      href="http://bing.com" // behaves like <a>
      target="_blank"
      title="let us bing!"
      disabled={disabled}
      checked={checked}
    >
      Bing
    </DefaultButton>
  );
};

// ---
// button with aria description
// ---

import * as React from 'react';
import { PrimaryButton } from 'office-ui-fabric-react';

export interface IButtonExampleProps {
  disabled?: boolean;
  checked?: boolean;
}

export const ButtonScreenReaderExample: React.FunctionComponent<IButtonExampleProps> = props => {
  const { disabled, checked } = props;

  return (
    <PrimaryButton ariaDescription="Detailed description used for screen reader." disabled={disabled} checked={checked}>
      Button with Aria Description
    </PrimaryButton>
  );
};-

// ---
// toggle button
// ---

import * as React from 'react';
import { DefaultButton, IIconProps } from 'office-ui-fabric-react';
import { useBoolean } from '@uifabric/react-hooks';

export interface IButtonExampleProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  disabled?: boolean;
  checked?: boolean;
}

const volume0Icon: IIconProps = { iconName: 'Volume0' };
const volume3Icon: IIconProps = { iconName: 'Volume3' };

export const ButtonToggleExample: React.FunctionComponent<IButtonExampleProps> = props => {
  const { disabled, checked } = props;
  const [muted, { toggle: setMuted }] = useBoolean(false);

  return (
    <DefaultButton
      toggle
      checked={muted || checked}
      text={muted ? 'Volume muted' : 'Volume unmuted'}
      iconProps={muted ? volume0Icon : volume3Icon}
      onClick={setMuted}
      allowDisabledFocus
      disabled={disabled}
    />
  );
};

// ---------
// checkbox
// ---------

// ---
// basic checkbox
// ---

import * as React from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

// Used to add spacing between example checkboxes
const stackTokens = { childrenGap: 10 };

export const CheckboxBasicExample: React.FunctionComponent = () => {
  // These checkboxes are uncontrolled because they don't set the `checked` prop.
  return (
    <Stack tokens={stackTokens}>
      <Checkbox label="Unchecked checkbox (uncontrolled)" onChange={_onChange} />

      <Checkbox label="Checked checkbox (uncontrolled)" defaultChecked onChange={_onChange} />

      <Checkbox label="Disabled checkbox" disabled />

      <Checkbox label="Disabled checked checkbox" disabled defaultChecked />
    </Stack>
  );
};

function _onChange(e: React.FormEvent<HTMLElement>, isChecked: boolean) {
  console.log(`The option has been changed to ${isChecked}.`);
}

// ---
// other checkboxes
// ---

import * as React from 'react';
import { Checkbox, ICheckboxProps } from 'office-ui-fabric-react/lib/Checkbox';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

// Optional extra props to pass through to the input element
const inputProps: ICheckboxProps['inputProps'] = {
  onFocus: () => console.log('Checkbox is focused'),
  onBlur: () => console.log('Checkbox is blurred'),
};
const stackTokens = { childrenGap: 10 };

export const CheckboxOtherExample: React.FunctionComponent = () => {
  // Only for the first checkbox, which is controlled
  const [isChecked, setIsChecked] = React.useState(true);
  const onChange = React.useCallback((e: React.FormEvent<HTMLElement>, checked: boolean): void => {
    setIsChecked(!!checked);
  }, []);

  return (
    <Stack tokens={stackTokens}>
      <Checkbox label="Controlled checkbox" checked={isChecked} onChange={onChange} />
      <Checkbox label='Checkbox rendered with boxSide "end"' boxSide="end" />
      <Checkbox label="Checkbox with extra props for the input" inputProps={inputProps} />
      <Checkbox label="Checkbox with link inside the label" onRenderLabel={_renderLabelWithLink} />
    </Stack>
  );
};

function _renderLabelWithLink() {
  return (
    <span>
      Custom-rendered label with a{' '}
      <Link href="https://www.microsoft.com" target="_blank">
        link
      </Link>
    </span>
  );
}


// ---
// indeterminate checkboxes
// ---

import * as React from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

const stackTokens = { childrenGap: 10 };

export const CheckboxIndeterminateExample: React.FunctionComponent = () => {
  const [isIndeterminate, setIsIndeterminate] = React.useState(true);
  const [isChecked, setIsChecked] = React.useState(false);
  const onChange = React.useCallback(
    (e: React.FormEvent<HTMLElement>, newChecked: boolean) => {
      if (isIndeterminate) {
        // If the checkbox was indeterminate, the first click should remove the indeterminate state
        // without affecting the checked state
        setIsIndeterminate(false);
      } else {
        setIsChecked(newChecked);
      }
    },
    [isIndeterminate],
  );

  return (
    <Stack tokens={stackTokens}>
      <Checkbox label="Indeterminate checkbox (uncontrolled)" defaultIndeterminate />

      <Checkbox
        label="Indeterminate checkbox which defaults to true when clicked (uncontrolled)"
        defaultIndeterminate
        defaultChecked={true}
      />

      <Checkbox label="Disabled indeterminate checkbox" disabled defaultIndeterminate />

      <Checkbox
        label="Indeterminate checkbox (controlled)"
        indeterminate={isIndeterminate}
        checked={isChecked}
        onChange={onChange}
      />
    </Stack>
  );
};


// ---------
// choice group (radio)
// ---------



// ---
// controlled choice group
// ---

import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

const options: IChoiceGroupOption[] = [
  { key: 'A', text: 'Option A' },
  { key: 'B', text: 'Option B' },
  { key: 'C', text: 'Option C', disabled: true },
  { key: 'D', text: 'Option D' },
];

export const ChoiceGroupControlledExample: React.FunctionComponent = () => {
  const [selectedKey, setSelectedKey] = React.useState<string>('B');

  const onChange = React.useCallback((e: React.SyntheticEvent<HTMLElement>, option: IChoiceGroupOption) => {
    setSelectedKey(option.key);
  }, []);

  return <ChoiceGroup selectedKey={selectedKey} options={options} onChange={onChange} label="Pick one" />;
};



// ---
// choice group (with images)
// ---

import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { TestImages } from '@uifabric/example-data';

const options: IChoiceGroupOption[] = [
  {
    key: 'bar',
    imageSrc: TestImages.choiceGroupBarUnselected,
    imageAlt: 'Bar chart icon',
    selectedImageSrc: TestImages.choiceGroupBarSelected,
    imageSize: { width: 32, height: 32 },
    text: 'Clustered bar chart', // This text is long to show text wrapping.
  },
  {
    key: 'pie',
    imageSrc: TestImages.choiceGroupBarUnselected,
    selectedImageSrc: TestImages.choiceGroupBarSelected,
    imageSize: { width: 32, height: 32 },
    text: 'Pie chart',
  },
];

export const ChoiceGroupImageExample: React.FunctionComponent = () => {
  return <ChoiceGroup label="Pick one image" defaultSelectedKey="bar" options={options} />;
};


// ---
// choice groups with icons
// ---

import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

const options: IChoiceGroupOption[] = [
  { key: 'day', text: 'Day', iconProps: { iconName: 'CalendarDay' } },
  { key: 'week', text: 'Week', iconProps: { iconName: 'CalendarWeek' } },
  { key: 'month', text: 'Month', iconProps: { iconName: 'Calendar' }, disabled: true },
];

export const ChoiceGroupIconExample: React.FunctionComponent = () => {
  return <ChoiceGroup label="Pick one icon" defaultSelectedKey="day" options={options} />;
};


// ---------
// combobox
// ---------


// ---
// controlled combobox
// ---

import * as React from 'react';
import { ComboBox, IComboBoxOption, IComboBox, SelectableOptionMenuItemType } from 'office-ui-fabric-react/lib/index';

const items: IComboBoxOption[] = [
  { key: 'Header1', text: 'First heading', itemType: SelectableOptionMenuItemType.Header },
  { key: 'A', text: 'Option A' },
  { key: 'B', text: 'Option B' },
  { key: 'C', text: 'Option C' },
  { key: 'D', text: 'Option D' },
  { key: 'divider', text: '-', itemType: SelectableOptionMenuItemType.Divider },
  { key: 'Header2', text: 'Second heading', itemType: SelectableOptionMenuItemType.Header },
  { key: 'E', text: 'Option E' },
  { key: 'F', text: 'Option F', disabled: true },
  { key: 'G', text: 'Option G' },
  { key: 'H', text: 'Option H' },
  { key: 'I', text: 'Option I' },
  { key: 'J', text: 'Option J' },
];

const comboBoxStyle = { maxWidth: 300 };

export const ComboBoxControlledExample: React.FC = () => {
  const [selectedKey, setSelectedKey] = React.useState<string | number | undefined>('C');

  const onChange = React.useCallback(
    (e: React.FormEvent<IComboBox>, option?: IComboBoxOption): void => {
      setSelectedKey(option?.key);
    },
    [setSelectedKey],
  );

  return (
    <ComboBox
      style={comboBoxStyle}
      selectedKey={selectedKey}
      label="Controlled single-select ComboBox (allowFreeform: T)"
      allowFreeform
      autoComplete="on"
      options={items}
      onChange={onChange}
    />
  );
};

// ---
// virtualized combobox (up to 1000 items)
// ---

import * as React from 'react';
import { IComboBoxOption, IComboBoxStyles, VirtualizedComboBox, Fabric } from 'office-ui-fabric-react';

const comboBoxOption: IComboBoxOption[] = Array.from({ length: 1000 }).map((x, i) => ({
  key: `${i}`,
  text: `Option ${i}`,
}));

const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: '300px' } };

export const ComboBoxVirtualizedExample: React.FC = () => (
  <Fabric className="ms-ComboBoxExample">
    <VirtualizedComboBox
      styles={comboBoxStyles}
      defaultSelectedKey="547"
      label="Scaled/virtualized example with 1000 items"
      allowFreeform
      autoComplete="on"
      options={comboBoxOption}
      dropdownMaxWidth={200}
      useComboBoxAsMenuWidth
    />
  </Fabric>
);

// ---
// combobox with error handling
// ---

import * as React from 'react';
import {
  ComboBox,
  IComboBoxProps,
  IComboBoxOption,
  SelectableOptionMenuItemType,
} from 'office-ui-fabric-react/lib/index';

const comboBoxBasicOptions: IComboBoxOption[] = [
  { key: 'Header1', text: 'First heading', itemType: SelectableOptionMenuItemType.Header },
  { key: 'A', text: 'Option A' },
  { key: 'B', text: 'Option B' },
  { key: 'C', text: 'Option C' },
  { key: 'D', text: 'Option D' },
  { key: 'divider', text: '-', itemType: SelectableOptionMenuItemType.Divider },
  { key: 'Header2', text: 'Second heading', itemType: SelectableOptionMenuItemType.Header },
  { key: 'E', text: 'Option E' },
  { key: 'F', text: 'Option F', disabled: true },
  { key: 'G', text: 'Option G' },
  { key: 'H', text: 'Option H' },
  { key: 'I', text: 'Option I' },
  { key: 'J', text: 'Option J' },
];

export const ComboBoxErrorHandlingExample: React.FC = () => {
  const [selectedKey, setSelectedKey] = React.useState<string | undefined>('');
  const onChange: IComboBoxProps['onChange'] = (event, option) => setSelectedKey(option!.key as string);

  return (
    <div>
      <ComboBox
        label="ComboBox with static error message"
        defaultSelectedKey="B"
        errorMessage="Oh no! This ComboBox has an error!"
        options={comboBoxBasicOptions}
      />

      <ComboBox
        label="ComboBox that errors when Option B is selected"
        options={comboBoxBasicOptions}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onChange}
        selectedKey={selectedKey}
        errorMessage={selectedKey === 'B' ? 'B is not an allowed option' : undefined}
      />
    </div>
  );
};

// ---------
// dropdown
// ---------

// ---
// controlled single-select dropdown
// ---

import * as React from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const dropdownControlledExampleOptions = [
  { key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
  { key: 'apple', text: 'Apple' },
  { key: 'banana', text: 'Banana' },
  { key: 'orange', text: 'Orange', disabled: true },
  { key: 'grape', text: 'Grape' },
  { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
  { key: 'broccoli', text: 'Broccoli' },
  { key: 'carrot', text: 'Carrot' },
  { key: 'lettuce', text: 'Lettuce' },
];

export const DropdownControlledExample: React.FunctionComponent = () => {
  const [selectedItem, setSelectedItem] = React.useState<IDropdownOption>();

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    setSelectedItem(item);
  };

  return (
    <Dropdown
      label="Controlled example"
      selectedKey={selectedItem ? selectedItem.key : undefined}
      // eslint-disable-next-line react/jsx-no-bind
      onChange={onChange}
      placeholder="Select an option"
      options={dropdownControlledExampleOptions}
      styles={dropdownStyles}
    />
  );
};

// ---
// controlled multi-select dropdown
// ---

import * as React from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from 'office-ui-fabric-react/lib/Dropdown';

const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 300 } };

const DropdownControlledMultiExampleOptions = [
  { key: 'fruitsHeader', text: 'Fruits', itemType: DropdownMenuItemType.Header },
  { key: 'apple', text: 'Apple' },
  { key: 'banana', text: 'Banana' },
  { key: 'orange', text: 'Orange', disabled: true },
  { key: 'grape', text: 'Grape' },
  { key: 'divider_1', text: '-', itemType: DropdownMenuItemType.Divider },
  { key: 'vegetablesHeader', text: 'Vegetables', itemType: DropdownMenuItemType.Header },
  { key: 'broccoli', text: 'Broccoli' },
  { key: 'carrot', text: 'Carrot' },
  { key: 'lettuce', text: 'Lettuce' },
];

export const DropdownControlledMultiExample: React.FunctionComponent = () => {
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

  const onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    if (item) {
      setSelectedKeys(
        item.selected ? [...selectedKeys, item.key as string] : selectedKeys.filter(key => key !== item.key),
      );
    }
  };

  return (
    <Dropdown
      placeholder="Select options"
      label="Multi-select controlled example"
      selectedKeys={selectedKeys}
      // eslint-disable-next-line react/jsx-no-bind
      onChange={onChange}
      multiSelect
      options={DropdownControlledMultiExampleOptions}
      styles={dropdownStyles}
    />
  );
};


// ---
// required dropdown
// ---

import * as React from 'react';
import { Dropdown, IDropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IStackTokens, Stack } from 'office-ui-fabric-react/lib/Stack';

const dropdownStyles = { dropdown: { width: 300 } };

export const DropdownRequiredExample: React.FunctionComponent = () => {
  const dropdownRef = React.createRef<IDropdown>();
  const stackTokens: IStackTokens = { childrenGap: 20 };

  return (
    <Stack tokens={stackTokens} verticalAlign="end">
      <Stack horizontal tokens={stackTokens} verticalAlign="end">
        <Dropdown
          componentRef={dropdownRef}
          placeholder="Select an option"
          label="Required dropdown example"
          options={[
            { key: 'A', text: 'Option a', title: 'I am option a.' },
            { key: 'B', text: 'Option b' },
            { key: 'C', text: 'Option c', disabled: true },
            { key: 'D', text: 'Option d' },
            { key: 'E', text: 'Option e' },
          ]}
          required
          styles={dropdownStyles}
        />
      </Stack>
      <Dropdown
        placeholder="Required with no label"
        ariaLabel="Required dropdown example"
        options={[
          { key: 'A', text: 'Option a', title: 'I am option a.' },
          { key: 'B', text: 'Option b' },
          { key: 'C', text: 'Option c', disabled: true },
          { key: 'D', text: 'Option d' },
          { key: 'E', text: 'Option e' },
        ]}
        required={true}
        styles={dropdownStyles}
      />
    </Stack>
  );
};


// ---------
// labels
// ---------

// https://developer.microsoft.com/en-us/fluentui#/controls/web/label

// ---------
// links
// ---------

// ---
// basic link
// ---

import * as React from 'react';
import { Link, Text } from 'office-ui-fabric-react';

export const LinkBasicExample: React.FunctionComponent = () => {
  return (
    <div>
      <Text>
        When a link has an href,{' '}
        <Link href="https://developer.microsoft.com/en-us/fluentui#/controls/web/link">
          it renders as an anchor tag.
        </Link>{' '}
        Without an href, <Link>the link is rendered as a button</Link>. You can also use the disabled attribute to
        create a{' '}
        <Link disabled={true} href="https://developer.microsoft.com/en-us/fluentui#/controls/web/link">
          disabled link.
        </Link>
      </Text>
      <Text>
        It's not recommended to use Links with imgs because Links are meant to render textual inline content. Buttons
        are inline-block or in the case of imgs, block. However, it is possible to create a linked image button by
        making a button with an unstyled variant and adding the img content and href source to that.
      </Text>
    </div>
  );
};

// ---------
// rating
// ---------

// ---
// ratings (mostly controlled)
// ---

import * as React from 'react';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import { getTheme, createTheme, ITheme } from 'office-ui-fabric-react/lib/Styling';

const getRatingComponentAriaLabel = (rating: number, maxRating: number): string => {
  return `Rating value is ${rating} of ${maxRating}`;
};

const customTheme: ITheme = createTheme(getTheme());
customTheme.semanticColors.bodySubtext = '#DFDFDF';
customTheme.semanticColors.bodyTextChecked = '#1E9FE8';

export const RatingBasicExample: React.FunctionComponent = () => {
  const [largeStarRating, setLargeStarsRating] = React.useState(1);
  const [smallStarRating, setSmallStarRating] = React.useState(3);
  const [tenStarRating, setTenStarRatingg] = React.useState(1);
  const [customIconStarRating, setCustomIconStarRating] = React.useState(2.5);
  const [themedStarRating, setThemedStarRating] = React.useState(1);

  const onLargeStarChange = (ev: React.FocusEvent<HTMLElement>, rating: number): void => {
    setLargeStarsRating(rating);
  };
  const onSmallStarChange = (ev: React.FocusEvent<HTMLElement>, rating: number): void => {
    setSmallStarRating(rating);
  };
  const onTenStarChange = (ev: React.FocusEvent<HTMLElement>, rating: number): void => {
    setTenStarRatingg(rating);
  };
  const onCustomIconStarChange = (ev: React.FocusEvent<HTMLElement>, rating: number): void => {
    setCustomIconStarRating(rating);
  };
  const onThemedStarChange = (ev: React.FocusEvent<HTMLElement>, rating: number): void => {
    setThemedStarRating(rating);
  };

  return (
    <div>
      Large Stars:
      <Rating
        min={1}
        max={5}
        size={RatingSize.Large}
        rating={largeStarRating}
        getAriaLabel={getRatingComponentAriaLabel}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onLargeStarChange}
        ariaLabelFormat={'Select {0} of {1} stars'}
      />
      Small Stars
      <Rating
        id="small"
        min={1}
        max={5}
        rating={smallStarRating}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onSmallStarChange}
        getAriaLabel={getRatingComponentAriaLabel}
        ariaLabelFormat={'Select {0} of {1} stars'}
      />
      10 Small Stars
      <Rating
        min={1}
        max={10}
        rating={tenStarRating}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onTenStarChange}
        getAriaLabel={getRatingComponentAriaLabel}
        ariaLabelFormat={'Select {0} of {1} stars'}
      />
      Custom icons:
      <Rating
        min={1}
        max={5}
        rating={customIconStarRating}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onCustomIconStarChange}
        getAriaLabel={getRatingComponentAriaLabel}
        ariaLabelFormat={'Select {0} of {1} stars'}
        icon="StarburstSolid"
        unselectedIcon="Starburst"
      />
      Themed star
      <Rating
        min={1}
        max={5}
        rating={themedStarRating}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onThemedStarChange}
        getAriaLabel={getRatingComponentAriaLabel}
        ariaLabelFormat={'Select {0} of {1} stars'}
        theme={customTheme}
      />
      Disabled:
      <Rating min={1} max={5} rating={1} disabled={true} ariaLabelFormat={'Select {0} of {1} stars'} />
      Half star in readOnly mode:
      <Rating
        min={1}
        max={5}
        rating={2.5}
        getAriaLabel={getRatingComponentAriaLabel}
        readOnly
        ariaLabelFormat={'Select {0} of {1} stars'}
      />
    </div>
  );
};

// ---------
// searchbox
// ---------

// ---
// default searchbox
// ---

import * as React from 'react';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';

const stackTokens: Partial<IStackTokens> = { childrenGap: 20 };

/* eslint-disable react/jsx-no-bind */
export const SearchBoxFullSizeExample = () => {
  return (
    <Stack tokens={stackTokens}>
      <SearchBox placeholder="Search" onSearch={newValue => console.log('value is ' + newValue)} />
      <SearchBox
        placeholder="Search with no animation"
        onSearch={newValue => console.log('value is ' + newValue)}
        disableAnimation
      />
      <SearchBox placeholder="Search" underlined={true} />

    </Stack>
  );
};

// ---------
// slider
// ---------


// ---
// horizontal slider
// ---

import * as React from 'react';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { IStackTokens, Stack, IStackStyles } from 'office-ui-fabric-react/lib/Stack';

const stackStyles: Partial<IStackStyles> = { root: { maxWidth: 300 } };
const stackTokens: IStackTokens = { childrenGap: 20 };
const sliderAriaValueText = (value: number) => `${value} percent`;
const sliderValueFormat = (value: number) => `${value}%`;

export const SliderBasicExample: React.FunctionComponent = () => {
  const [sliderValue, setSliderValue] = React.useState(0);
  const sliderOnChange = (value: number) => setSliderValue(value);
  return (
    <Stack tokens={stackTokens} styles={stackStyles}>
      <Slider />
      <Slider label="Snapping slider example" min={0} max={50} step={10} defaultValue={20} showValue snapToStep />
      <Slider label="Disabled example" min={50} max={500} step={50} defaultValue={300} showValue disabled />
      <Slider
        label="Controlled example"
        max={10}
        value={sliderValue}
        showValue
        // eslint-disable-next-line react/jsx-no-bind
        onChange={sliderOnChange}
      />
      <Slider
        label="Example with formatted value"
        max={100}
        ariaValueText={sliderAriaValueText}
        valueFormat={sliderValueFormat}
        showValue
      />
      <Slider label="Origin from zero" min={-5} max={5} step={1} defaultValue={2} showValue originFromZero />
    </Stack>
  );
};


// ---
// vertical slider
// ---

import * as React from 'react';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { IStackTokens, Stack, IStackStyles } from 'office-ui-fabric-react/lib/Stack';

const stackStyles: Partial<IStackStyles> = { root: { height: 200 } };
const stackTokens: IStackTokens = { childrenGap: 20 };

export interface ISliderVerticalExampleState {
  value: number;
}

/* eslint-disable react/jsx-no-bind */
export const SliderVerticalExample: React.FunctionComponent = () => {
  return (
    <Stack horizontal tokens={stackTokens} styles={stackStyles}>
      <Slider // prettier-ignore
        label="Basic"
        min={1}
        max={5}
        step={1}
        defaultValue={2}
        showValue
        vertical
      />
      <Slider // prettier-ignore
        label="Disabled"
        min={50}
        max={500}
        step={50}
        defaultValue={300}
        showValue
        vertical
        disabled
      />
      <Slider // prettier-ignore
        label="Controlled"
        max={10}
        vertical
        showValue
      />
      <Slider // prettier-ignore
        label="Formatted value"
        max={100}
        valueFormat={(value: number) => `${value}%`}
        showValue
        vertical
      />
      <Slider // prettier-ignore
        label="Origin from zero"
        min={-5}
        max={15}
        step={1}
        defaultValue={5}
        showValue
        vertical
        originFromZero
      />
    </Stack>
  );
};

// ---------
// spinbutton
// ---------


// https://developer.microsoft.com/en-us/fluentui#/controls/web/spinbutton


// ---------
// textfield
// ---------

// https://developer.microsoft.com/en-us/fluentui#/controls/web/textfield

// ---
// controlled field
// ---

import * as React from 'react';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };
const narrowTextFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 100 } };
const stackTokens = { childrenGap: 15 };

export const TextFieldControlledExample: React.FunctionComponent = () => {
  const [firstTextFieldValue, setFirstTextFieldValue] = React.useState('');
  const [secondTextFieldValue, setSecondTextFieldValue] = React.useState('');
  const onChangeFirstTextFieldValue = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setFirstTextFieldValue(newValue || '');
    },
    [],
  );
  const onChangeSecondTextFieldValue = React.useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      if (!newValue || newValue.length <= 5) {
        setSecondTextFieldValue(newValue || '');
      }
    },
    [],
  );

  return (
    <Stack tokens={stackTokens}>
      <TextField
        label="Basic controlled TextField"
        value={firstTextFieldValue}
        onChange={onChangeFirstTextFieldValue}
        styles={textFieldStyles}
      />
      <TextField
        label="Controlled TextField limiting length of value to 5"
        value={secondTextFieldValue}
        onChange={onChangeSecondTextFieldValue}
        styles={narrowTextFieldStyles}
      />
    </Stack>
  );
};


// ---
// textfield variants
// ---

import * as React from 'react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps, IStackStyles } from 'office-ui-fabric-react/lib/Stack';

const stackTokens = { childrenGap: 50 };
const iconProps = { iconName: 'Calendar' };
const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
const columnProps: Partial<IStackProps> = {
  tokens: { childrenGap: 15 },
  styles: { root: { width: 300 } },
};

export const TextFieldBasicExample: React.FunctionComponent = () => {
  return (
    <Stack horizontal tokens={stackTokens} styles={stackStyles}>
      <Stack {...columnProps}>
        <TextField label="Standard" />
        <TextField label="Disabled" disabled defaultValue="I am disabled" />
        <TextField label="Read-only" readOnly defaultValue="I am read-only" />
        <TextField label="Required " required />
        <TextField ariaLabel="Required without visible label" required />
        <TextField label="With error message" errorMessage="Error message" />
      </Stack>
      <Stack {...columnProps}>
        <MaskedTextField label="With input mask" mask="m\ask: (999) 999 - 9999" />
        <TextField label="With an icon" iconProps={iconProps} />
        <TextField label="With placeholder" placeholder="Please enter text here" />
        <TextField label="Disabled with placeholder" disabled placeholder="I am disabled" />
      </Stack>
    </Stack>
  );
};

// ---------
// toggle (switch)
// ---------

// ---
// basic toggles
// ---

import * as React from 'react';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Stack, IStackTokens } from 'office-ui-fabric-react/lib/Stack';

const stackTokens: IStackTokens = { childrenGap: 10 };

const [checked, setChecked] = React.useState(false);

export const ToggleBasicExample: React.FunctionComponent = () => {
  return (
    <Stack tokens={stackTokens}>
      <Toggle label="Controlled" checked={checked} onText="On" offText="Off" onChange={() => setChecked(!checked)} />
      <Toggle label="Enabled and checked" defaultChecked onText="On" offText="Off" onChange={_onChange} />
      <Toggle label="Enabled and unchecked" onText="On" offText="Off" onChange={_onChange} />
      <Toggle label="Disabled and checked" defaultChecked disabled onText="On" offText="Off" />
      <Toggle label="Disabled and unchecked" disabled onText="On" offText="Off" />
      <Toggle label="With inline label" inlineLabel onText="On" offText="Off" onChange={_onChange} />
      <Toggle label="Disabled with inline label" inlineLabel disabled onText="On" offText="Off" />
      <Toggle label="With inline label and without onText and offText" inlineLabel onChange={_onChange} />
      <Toggle label="Disabled with inline label and without onText and offText" inlineLabel disabled />
      <Toggle
        label="Enabled and checked (ARIA 1.0 compatible)"
        defaultChecked
        onText="On"
        offText="Off"
        onChange={_onChange}
        role="checkbox"
      />
    </Stack>
  );
};

function _onChange(ev: React.MouseEvent<HTMLElement>, checked: boolean) {
  console.log('toggle is ' + (checked ? 'checked' : 'not checked'));
}


// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---
// ---

// ---------
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---

// ---
//
// ---
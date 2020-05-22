order: 5
---

## Introduction

Editors determine how a field's value is display in read-only views such as the list and detail view, and how the value is edited in the form views (i.e. the edit and create views).

StellarAdmin currently has support for the following field editors:

* [Boolean Editor](#boolean-editor)
* [Date Editor](#date-editor)
* [Date/Time Editor](#datetime-editor)
* [Select Editor](#select-editor)
* [Text Editor](#text-editor)

## Default editors

StellarAdmin tries to apply intelligent defaults to determine the editor for a particular field based on the data type of the field. For example, if the data type is a `DateTime` or `DateTimeOffset`, StellarAdmin will use 


Editor | Default for
---------|----------
 Boolean Editor | All fields with a data type of `bool`
 Date/Time Editor | All fields with a data type of `DateTime` or `DateTimeOffset`
 Select Editor | All fields with an `enum` data type.
 Text Editor | All fields that do not match any of the other criteria

## Specifying an editor

If you are not happy with the defaults, or you want to specify extra parameters for the editor, you can specify an editor in the `configureField` callback when defining a field:

```cs
// Specify a date-only field editor
CreateField(l => l.StartDate, field => field.UseEditor<DateEditor>());
```

## Editor types

### Boolean Editor

The `BooleanEditor` allows you to edit boolean values.

### Date Editor

The `DateEditor` allows you to edit date values.

### Date/Time Editor

The `DateTimeEditor` allows you to edit date/time values.

### Select Editor

The `SelectEditor` allows you to select an item from a list of values. When used with an `enum` data type, the editor automatically displays the members of the type. You can use this in combination with the `DisplayAttribute` the specify the display text of the select editor.

```cs
public enum InterventionLinkType
{
    [Display(Name = "More Information")]
    MoreInfo = 0,

    [Display(Name = "Buy Item")]
    Buy = 1
}
```

### Text Editor

The `TextEditor` allows you to edit a value using a simple text input field.

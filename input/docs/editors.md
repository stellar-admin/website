order: 7
---

## Introduction

Editors determine how a field's value is display in read-only views such as the list and detail view, and how the value is edited in the form views (i.e. the edit and create views).

StellarAdmin has the following field editors:

* [Boolean Editor](#boolean-editor)
* [Date Editor](#date-editor)
* [Date/Time Editor](#datetime-editor)
* [Image Editor](#image-editor)
* [Markdown Editor](#markdown-editor)
* [Select Editor](#select-editor)
* [Text Area Editor](#text-area-editor)
* [Text Editor](#text-editor)

## Default editors

StellarAdmin determines the default editor for a field based on the data type of the field. The table below lists the circumstances under which each editor will be configured as the default.

Editor | Default for
---------|----------
 Boolean Editor | All `bool` fields.
 Date/Time Editor | All `DateTime` and `DateTimeOffset` fields.
 Select Editor | All `enum` fields.
 Text Editor | All fields that do not match any of the criteria above.

## Specifying an editor

You can specify a specific editor by calling the `HasEditor<TEditor>()` method when adding a field. The `HasEditor<TEditor>()` method has an optional `configureEditor` parameter that allows you to specify properties to customize the editor, such as the display format for the `DateEditor` in the example below.

```cs
builder.AddResource<BlogPost>(rb =>
{
    rb.AddField(post => post.Title);
    rb.AddField(post => post.PublishDate, f => 
        {
            f.HasEditor<DateEditor>((editor, _) => editor.DisplayFormat = "FFF");
        });
    rb.AddField(post => post.AuthorId);
    rb.AddField(post => post.Content, f => f.HasEditor<MarkdownEditor>());
});
```

## Editor types

### Boolean Editor

The `BooleanEditor` allows you to edit boolean values.

### Date Editor

The `DateEditor` allows you to edit date values.

### Date/Time Editor

The `DateTimeEditor` allows you to edit date/time values.

### Image Editor

...

### Markdown Editor

...

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

### Text Area Editor

...

### Text Editor

The `TextEditor` allows you to edit a value using a simple text input field.

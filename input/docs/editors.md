order: 5
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

StellarAdmin tries to apply intelligent defaults to determine the editor for a particular field based on the data type of the field. The table below lists the circumstances under which each editor will be configured by default.

Editor | Default for
---------|----------
 Boolean Editor | All fields with a data type of `bool`
 Date/Time Editor | All fields with a data type of `DateTime` or `DateTimeOffset`
 Select Editor | All fields with an `enum` data type.
 Text Editor | All fields that do not match any of the other criteria

## Specifying an editor

If you are not happy with the default editor, you can specify an editor when adding a field by calling the `HasEditor<TEditor>()` method. The `HasEditor<TEditor>()` method has an optional `configureEditor` parameter that allows you to specify parameters to customize the editor, such as the display format for the `DateEditor`.

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

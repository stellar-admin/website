order: 4
---

## Specifying fields

You will need to define the fields of your resource definition. You can do this by calling the `HasField()` method of resource definition, passing a lamba expression representing the field as the `expression` parameter.

Let's assume you have the following resource.

```cs
public class Contact
{
    public int Id { get; set; }

    public string Email { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }
}
```

You can define a resource definition called `ContactDefinition` and define each of the fields in the constructor as follows:

```cs
public class ContactDefinition : Definition<ApplicationDbContext, Contact>
{
    public ContactDefinition()
    {
        HasField(c => c.Id, f => f.IsKey = true);
        HasField(c => c.FirstName);
        HasField(c => c.LastName);
        HasField(c => c.Email);
    }
}
```

## Specifying field attributes

Note in the example above that the field definition for the `Id` propery has extra parameters defined. The optional `configureField` parameter of the `HasField` method is a callback that allows you to specify extra attributes for the field.

### Specifying a key field

If the example above we define the `Id` property as the **key field** for the resource. It is important to specify a key field for a resource. If no key field is specified, you will not be able to view, edit, create or delete resource for that particular resource definition - you will only be able to see a list view.

### Specifying display attributes

The `configureField` callback allows you to control various aspects of the field. You can, for example, specify the `Label` and `HelpText`.

### Specifying field visibility

You can also control visibility of a field by calling the various `Hide*` methods. `Hide()` will hide a field in all views. This is useful, for example for key fields that you never want to display to the user. Or maybe you want the key field to only be visible in the list and detail views, in which case you can call the `HideOnForms()` method that will hide the field in the edit and create views.

## Specifying the name of the field

The second optional parameter for the `HasField` method is the `name` parameter. By default, the `Name` of the field will be determined by the underlying property name, but there may be case we specifying the name field is required. For example, if your field does not reference a property, but is a complex expression like the following:

```cs
HasField(c => $"{c.FirstName} {c.LastName}");
```

In this case StellarAdmin will be unable to determine the name and you will have to explicitly define a name:

```cs
HasField(c => $"{c.FirstName} {c.LastName}", name: "Fullname");
```

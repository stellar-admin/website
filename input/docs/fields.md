order: 4
---

## Automatic fields

By default, StellarAdmin will automatically add all simple properties of the underlying resource model as fields. StellarAdmin uses data annotations to determine fields attributes such as the field `Label`, `Description` etc.

## Manually define fields

To manually define fields for your resource definition, override the `CreateFields()` method in your resource definition and return an `IEnumerable<IField>` that contains the list of fields. You can define a field by calling the `CreateField()` method of the base class, passing a lambda expression representing the field as the `expression` parameter.

Let's assume you have the following resource.

```cs
public class Contact
{
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }
}
```

Create a resource definition called `ContactDefinition` and define each of the fields in the `CreateFields()` method as follows:

```cs
public class ContactDefinition : Definition<ApplicationDbContext, Contact>
{
    protected override IEnumerable<IField> CreateFields()
    {
        return new IField[]
        {
            CreateField(c => c.Id, f => f.IsKey = true),
            CreateField(c => c.FirstName),
            CreateField(c => c.LastName),
            CreateField(c => c.EmailAddress),
            CreateField(c => c.PhoneNumber, f => f.HideOnList())
        };
    }
}
```

## Specifying field attributes

Note in the example above that the field definition for the `Id` property has extra parameters defined. The optional `configureField` parameter of the `CreateField` method is a callback that allows you to specify extra attributes for the field.

### Specifying a key field

If the example above, we define the `Id` property as the **key field** for the resource. It is essential to specify a key field for a resource. If no key field is specified, you cannot view, edit, create or delete resource for that particular resource definition - you can only see a list view.

### Specifying display attributes

The `configureField` callback allows you to control various aspects of the field. You can, for example, specify the `Label` and `HelpText`.

### Specifying field visibility

You can also control the visibility of a field by calling the various `Hide*` methods. `Hide()` hides a field in all views. This is useful, for example, for key fields that you never want to display to the user. Or maybe you want the key field to only be visible in the list and detail views, in which case you can call the `HideOnForms()` method that hides the field in the edit and create views.

## Specifying the name of the field

The second optional parameter for the `CreateField` method is the `name` parameter. By default, the `Name` of the field is determined by the underlying property name, but there may be cases where specifying the name field is required. For example, if your field does not reference a property, but is a complex expression like the following:

```cs
CreateField(c => $"{c.FirstName} {c.LastName}");
```

In this case StellarAdmin will be unable to determine the name and you will have to explicitly define a name:

```cs
CreateField(c => $"{c.FirstName} {c.LastName}", name: "Fullname");
```

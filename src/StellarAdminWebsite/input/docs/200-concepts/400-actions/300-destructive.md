title: Destructive actions
---

Some actions are destructive as they can irreversibly alter resources. For such actions, you can indicate to the user that they are about to perform a dangerous action by calling the `IsDestructive()` method during registration.

```cs
builder.AddResource<BlogPost>(rb =>
{
    // ...

    rb.AddAction<UnpublishPost>("Unpublish",
        actionBuilder =>
        {
            // ...

            actionBuilder.IsDestructive();
        });
});
```

The button the user clicks will give a visual indication that the action is dangerous.

![The button for a destructive action](images/destructive-action.png)

For actions that display a dialog, the appearance of the dialog icon and confirm button will also be altered to indicate to the user that they are about to perform a dangerous action.

![The dialog for a destructive action](images/destructive-action-dialog.png)

module.exports = {
    name: "ControlPanel",
    description: "",
    apps : [
        {
            name: "BookStore",
            entry_point: "launch_bookstore"
        }
    ],
    types: [
        {
            name: 'Book',
            plural: 'books'
        }
    ]
}
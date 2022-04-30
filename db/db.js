const users = [{
        email: 'yungdansa@gmail.com',
        password: 'Testing',
    },
    {
        email: 'yung@gmail.com',
        password: 'Testing',
    },
    {
        email: 'test@hot.com',
        password: 'Testing',
    },
    {
        email: 'me@yahoo.com',
        password: 'Testing',
    },
    {
        email: 'really@gmail.com',
        password: 'reality',
    },
]

const public = [{
        title: 'free tips on dev',
        content: 'some tips',
    },
    {
        title: 'free tips on dev 1',
        content: 'some tips 1',
    },
    {
        title: 'free tips on dev 2',
        content: 'some tips 2',
    },
]

const private = [{
        title: 'private or paid',
        content: 'private content',
    },
    {
        title: 'private 1',
        content: 'private content 1',
    },
    {
        title: 'private 2',
        content: 'private content 2',
    },
]

const posts = [{
        title: 'First post',
        content: 'This is my first post',
        no_of_likes: 1,
        no_of_comments: 1,
        people_engages_in_post: ['2'],
        date: '2022-04-29T12:48:48.540Z',
        _id: '626bdecea087b468848e7c5b',
    },
    {
        title: 'Second post',
        content: 'This is my second post',
        no_of_likes: 1,
        no_of_comments: 1,
        people_engages_in_post: ['2'],
        date: '2022-04-29T12:48:48.540Z',
        _id: '626bdecea087b468848e7c45',
    },
]

module.exports = { users, public, private, posts }
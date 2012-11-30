# binpub.com API, the back-end for YSenate.org political organization engine.
Your open-source organization  place. Backend part.

## Getting started
This project aims to mimic the backend part of [ost.io](http://ost.io/) application.

Ostio api is built with [Rails](http://rubyonrails.org/).

binpub.com api is built with node.js restify (http://mcavage.github.com/node-restify/)

## Running tests
Make sure the dev dependencies are first installed before running the tests:
    $ npm installl

then run the tests:
    $ make tests
    
## Deploying (only authentication and simple test works now, below is TODO)
clone
TODO: update package.json
* Add your GitHub app id / secret as JSON  to ./secret/secret.js

```

## API
Current API version is v0.1 You need to prepend `v0/` to app requests except auth.
TODO: Almost everything except github AUTH; api not functioal yet.
* [Users](#users-api)
* [Topics](#repos-api)
* [Repos](#topics-api)
* [Posts](#posts-api)

### Auth
All requests that change state (`POST`, `PUT`, `DELETE`) require authentication.

Currently only authentication via `GET` param is supported.

Just add `?access_token=x` to your URLs. Access token can be get when user
logs in (any request to `/auth/github`).

### Users API
`:username` is a user name user has on GitHub.

#### Get user data
`GET /users/:username`

**Example:** http://api.ost.io/v1/users/paulmillr

#### Delete user
`DELETE /users/:username`

### Repos API
`:repo_name` is a repository name it has on GitHub.

#### List user repos
`GET /users/:username/repos/`

**Example:** http://api.ost.io/v1/users/paulmillr/repos/

#### Sync repos with GitHub
`POST /users/:username/repos/`

#### Get repo data
`GET /users/:username/repos/:repo_name`

**Example:** http://api.ost.io/v1/users/paulmillr/repos/ostio

### Topics API
`:topic_number` is a number, local to current repository.

#### List repo topics
`GET /users/:username/repos/:repo_name/topics/`

**Example:** http://api.ost.io/v1/users/paulmillr/repos/ostio/topics/

#### Create new topic
`POST /users/:username/repos/:repo_name/topics/`

Input:

* **title**: *Required* **string**

#### Get topic data
`GET /users/:username/repos/:repo_name/topics/:topic_number`

**Example:** http://api.ost.io/v1/users/paulmillr/repos/ostio/topics/1

#### Modify topic
`PUT /users/:username/repos/:repo_name/topics/:topic_number`

Input:

* **title**: *Required* **string*&

#### Delete topic
`DELETE /users/:username/repos/:repo_name/topics/:topic_number`

### Posts API
### List topic posts
`GET /users/:username/repos/:repo_name/topics/:topic_number/posts/`

**Example:** http://api.ost.io/v1/users/paulmillr/repos/ostio/topics/1/posts/

#### Create new post
`POST /users/:username/repos/:repo_name/topics/:topic_number/posts/`

Input:

* **text**: *Required* **string*

#### Get post data
`GET /users/:username/repos/:repo_name/topics/:topic_number/posts/:id`

**Example:** http://api.ost.io/v1/users/paulmillr/repos/ostio/topics/1/posts/8

#### Modify post
`PUT /users/:username/repos/:repo_name/topics/:topic_number/posts/:id`

Input:

* **text**: *Required* **string*

#### Delete post
`DELETE /users/:username/repos/:repo_name/topics/:topic_number/posts/:id`

## License
The MIT License (MIT)

Copyright (c) 2012 Paul Miller (http://paulmillr.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the .Software.), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED .AS IS., WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

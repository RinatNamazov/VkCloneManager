# VkCloneManager
VkCloneManager is a [VK](https://vk.com) accounts manager for centralized action management.

![VkCloneManagerInterface](/images/VkCloneManagerInterface.png)

The original idea is taken from here: https://github.com/galqiwi/vk-clones
<details>
  <summary>Funny screenshots</summary>

Thanks to [EvgeN 1137](https://github.com/evgen1137) for providing screenshots from his friends.

![VkCloneManagerPhoto0](/images/VkCloneManagerPhoto0.jpg)
![VkCloneManagerPhoto1](/images/VkCloneManagerPhoto1.jpg)
![VkCloneManagerPhoto2](/images/VkCloneManagerPhoto2.jpg)
![VkCloneManagerPhoto3](/images/VkCloneManagerPhoto3.jpg)
![VkCloneManagerPhoto4](/images/VkCloneManagerPhoto4.jpg)
![VkCloneManagerPhoto4](/images/VkCloneManagerPhoto5.jpg)
</details>

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install this project.
```bash
npm install https://github.com/RinatNamazov/VkCloneManager
```

## Usage
Use the following command in the directory where you installed this project.
```bash
npm start
```

## Config
The config can be edited in the config.js file.
```js
const config = {
    rucaptcha_api_key: "", // Optional. https://rucaptcha.com/
    accounts: [
        {
            name: "", // Optional, acts like a comment.
            username: "", // Phone number or email.
            password: "",
            proxy: "" // Optional.
        },
        {
            username: "",
            password: "",
        }
        // The number of accounts is not limited.
    ]
};
```

Proxies can be specified in the following format:
```
socks5://192.168.0.1:1080
http://192.168.0.1:8080
protocol://username:password@address:port
```

## License
The code in this repository is licensed under GNU GPL v3.
```
Copyright (c) 2021 RINWARES, Rinat Namazov

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
```

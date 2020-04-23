# NEO Nodes

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Update notes
With matrix feature added, version >= 1.3 must change env file structure. e.g:
```python
# before
VUE_APP_RESTAPI = protocal://hostname:port/api/nodes
# after
VUE_APP_RESTAPI = protocal://hostname:port/api
```
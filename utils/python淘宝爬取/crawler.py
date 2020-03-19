# -*- coding:utf-8 -*-
"""
@Author: ck
"""

import sys
import os
import urllib  # 用于encode
import urllib2
import re
import random
import gzip
import StringIO
import time
import threading
import json
import sqlite3
from itertools import permutations
import win32crypt
from pyquery import PyQuery as pq


class CookieException(Exception):
    def __init__(self, err='cookie获取失败'):
        Exception.__init__(self, err)


class ProxyException(Exception):
    def __init__(self, err='代理设置失败'):
        Exception.__init__(self, err)


print_charset = sys.stdout.encoding

lock = threading.Lock()  # 创建线程锁


def test(proxy_host):
    """
    验证代理IP有效性的方法
    :param proxy_host:
    :return:
    """
    try:
        request = urllib2.Request('http://cn.bing.com/')  # 用于验证代理是否有效
        request.add_header(
            'User-Agent',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36')
        urllib2.install_opener(urllib2.build_opener(urllib2.ProxyHandler({'http': proxy_host})))
        http_code = urllib2.urlopen(request, timeout=5).getcode()
        if http_code == 200:
            return proxy_host
    except Exception as e:
        print e
        return None


def set_proxy():
    """
    设置代理
    """
    # 获取xicidaili的高匿代理
    proxy_info_list = []  # 抓取到的ip列表
    for page in range(1, 2):  # 暂时只抓第一页
        request = urllib2.Request('http://www.xicidaili.com/nn/%d' % page)
        request.add_header('Accept-Encoding', 'gzip, deflate')
        request.add_header('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
        request.add_header('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6')
        request.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36')
        response = urllib2.urlopen(request, timeout=5)

        headers = response.info()
        content_type = headers.get('Content-Type')
        if content_type:
            charset = re.findall(r"charset=([\w-]+);?", content_type)[0]
        else:
            charset = 'utf-8'
        if headers.get('Content-Encoding') == 'gzip':
            gz = gzip.GzipFile(fileobj=StringIO.StringIO(response.read()))
            content = gz.read().decode(charset)
            gz.close()
        else:
            content = response.read().decode(charset)
        response.close()
        print u'获取第 %d 页' % page
        ip_page = re.findall(r'<td>(\d.*?)</td>', content)
        proxy_info_list.extend(ip_page)
        time.sleep(random.choice(range(1, 3)))

    # 打印抓取的内容
    print u'代理IP地址\t端口\t存活时间\t验证时间'
    for i in range(0, len(proxy_info_list), 4):
        print u'%s\t%s\t%s\t%s' % (proxy_info_list[i], proxy_info_list[i + 1], proxy_info_list[i + 2], proxy_info_list[i + 3])

    all_proxy_list = []  # 待验证的代理列表
    # proxy_list = []  # 可用的代理列表
    for i in range(0, len(proxy_info_list), 4):
        proxy_host = proxy_info_list[i] + ':' + proxy_info_list[i + 1]
        all_proxy_list.append(proxy_host)

    # 开始验证

    # 单线程方式
    for i in range(len(all_proxy_list)):
        proxy_host = test(all_proxy_list[i])
        if proxy_host:
            break
    else:
        # TODO 进入下一页
        print u'没有可用的代理'
        return None

    # 多线程方式
    # threads = []
    # # for i in range(len(all_proxy_list)):
    # for i in range(5):
    #     thread = threading.Thread(target=test, args=[all_proxy_list[i]])
    #     threads.append(thread)
    #     time.sleep(random.uniform(0, 1))
    #     thread.start()
    #
    # # 等待所有线程结束
    # for t in threading.enumerate():
    #     if t is threading.currentThread():
    #         continue
    #     t.join()
    #
    # if not proxy_list:
    #     print u'没有可用的代理'
    #     # TODO 进入下一页
    #     sys.exit(0)
    print u'使用代理： %s' % proxy_host
    urllib2.install_opener(urllib2.build_opener(urllib2.ProxyHandler({'http': proxy_host})))


def get_base_info(page_url):
    """
    从页面获取基本的参数
    :param page_url:
    :return:
    """
    page_url = page_url.strip()
    cookie_str, host = get_cookie(page_url)
    print u'page cookie ：', cookie_str

    request = urllib2.Request(page_url)
    request.add_header('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8')
    request.add_header('Accept-Encoding', 'gzip, deflate, br')
    request.add_header('Cookie', cookie_str)
    request.add_header('Host', host)
    request.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36')
    response = urllib2.urlopen(request)
    headers = response.info()
    content_type = headers.get('Content-Type')
    if content_type:
        charset = re.findall(r"charset=([\w-]+);?", content_type)[0]
    else:
        charset = 'utf-8'
    if headers.get('Content-Encoding') == 'gzip':
        gz = gzip.GzipFile(fileobj=StringIO.StringIO(response.read()))
        content = gz.read().decode(charset)
        gz.close()
    else:
        content = response.read().decode(charset)
    with open(u'.\content.html', 'w+') as page_file:
        page_file.write(content.encode(print_charset))  # 写入文件待观察
    # 获取item_id
    item_id = re.findall(r'(^|&)id=([^&]*)(&|$)', page_url[page_url.find('?'):])[0][1]
    # 获取sku_dict
    sku_map = json.loads(re.findall(r'skuMap\s*:\s*(\{.*\})\n\r?', content)[0])
    sku_dict = {}
    for k, v in sku_map.items():
        sku_dict[k] = {
            'price': v['price'],  # 非推广价
            'stock': v['stock'],  # 库存
            'sku_id': v['skuId']  # skuId
        }
    ct = re.findall(r'"ct"\s*:\s*"(\w*)",', content)[0]
    timestamp = int(time.time())
    doc = pq(content)
    # ========== 获取每个类别属性及其属性值的集合 start ==========
    prop_to_values = {}
    for prop in doc('.J_Prop ').items():
        values = []
        for v in prop.find('li').items():
            values.append({
                'name': v.children('a').text(),
                'code': v.attr('data-value')
            })
            prop_to_values[prop.find('.tb-property-type').text()] = values
    # ========== end ==========
    return {
        'ct': ct,
        'nekot': timestamp,
        'item_id': item_id,
        'prop_to_values': prop_to_values,
        'sku_dict': sku_dict
    }


def get_sale_info(sib_url):
    """
    获取可以出售的商品信息
    :param sib_url:
    :return:
    """
    cookie_str, host = get_cookie(sib_url)
    print u'sale cookie ：', cookie_str

    request = urllib2.Request(sib_url)
    request.add_header('Accept', '*/*')
    request.add_header('Accept-Encoding', 'gzip, deflate, br')
    request.add_header('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6')
    request.add_header('Connection', 'keep - alive')
    request.add_header('Cookie', cookie_str)
    request.add_header('Host', host)
    request.add_header('Referer', 'https://item.taobao.com')
    request.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36')
    response = urllib2.urlopen(request)

    headers = response.info()

    # 获取字符集
    content_type = headers.get('Content-Type')
    if content_type:
        charset = re.findall(r"charset=([\w-]+);?", content_type)[0]
    else:
        charset = 'utf-8'

    if headers.get('Content-Encoding') == 'gzip':
        gz = gzip.GzipFile(fileobj=StringIO.StringIO(response.read()))
        content = gz.read().decode(charset)
        gz.close()
    else:
        content = response.read().decode(charset)
    json_obj = json.loads(content)
    sellable_sku = json_obj['data']['dynStock']['sku']  # 可以售卖的sku
    promo_sku = json_obj['data']['promotion']['promoData']  # 推广中的sku
    if promo_sku:
        for k, v in sellable_sku.items():
            promos = promo_sku[k]
            if len(promos) > 1:
                print u'有多个促销价，建议手动确认'
            price = 0
            for p in promos:
                if p['price'] < price:
                    price = p['price']
            price = min([float(x['price']) for x in promos])
            v['price'] = price
            # TODO amountRestriction 限购数量
    return sellable_sku


def get_cookie(url):
    """
    获取该的可用cookie
    :param url:
    :return:
    """

    domain = urllib2.splithost(urllib2.splittype(url)[1])[0]
    domain_list = ['.' + domain, domain]
    if len(domain.split('.')) > 2:
        dot_index = domain.find('.')
        domain_list.append(domain[dot_index:])
        domain_list.append(domain[dot_index + 1:])
    print domain_list
    conn = None
    cookie_str = None
    try:
        conn = sqlite3.connect(r'%s\Google\Chrome\User Data\Default\Cookies' % os.getenv('LOCALAPPDATA'))
        cursor = conn.cursor()
        sql = 'select host_key, name, value, encrypted_value, path from cookies where host_key in (%s)' % ','.join(['"%s"' % x for x in domain_list])
        row_list = cursor.execute(sql).fetchall()
        cookie_list = []
        for host_key, name, value, encrypted_value, path in row_list:
            decrypted_value = win32crypt.CryptUnprotectData(encrypted_value, None, None, None, 0)[1].decode(print_charset) or value
            cookie_list.append(name + '=' + decrypted_value)
        cookie_str = '; '.join(cookie_list)
    except Exception:
        raise CookieException()
    finally:
        conn.close()
        print cookie_str
        return cookie_str, domain


def get_item_info():
    page_url = raw_input(u'请输入商品地址：'.encode(print_charset)).decode(print_charset)
    base_info = get_base_info(page_url)
    item_id = base_info['item_id']
    modules = ['dynStock', 'qrcode', 'viewer', 'price', 'duty', 'xmpPromotion', 'delivery', 'activity',
               'fqg', 'zjys', 'couponActivity', 'soldQuantity', 'contract', 'tradeContract']
    ajax_url = 'https://detailskip.taobao.com/service/getData/1/p1/item/detail/sib.htm?itemId=%s&modules=%s' % (item_id, ','.join(modules))
    print 'request -> ', ajax_url
    sku_dict = get_sale_info(ajax_url)
    prop_to_values = base_info['prop_to_values']
    base_info_sku_dict = base_info['sku_dict']
    info = {
        'ct': base_info['ct'],
        'nekot': base_info['nekot'],
        'item_id': base_info['item_id'],
        'prop_to_values': prop_to_values,
    }
    for k, v in sku_dict.items():
        v['sku_id'] = base_info_sku_dict[k].get('sku_id')
        if 'price' not in v.keys():
            v['price'] = base_info_sku_dict[k].get('price')
    info['sku_dict'] = sku_dict
    with open(u'.\sku.json', 'w+') as sku_file:
        sku_file.write(json.dumps(info, ensure_ascii=False).encode('utf-8'))
    code_list = []
    item_prop = raw_input(u'请输入商品类别名称（如：颜色分类，直接回车结束输入）：'.encode(print_charset)).decode(print_charset)
    while item_prop:
        if item_prop in prop_to_values.keys():
            prop_values = prop_to_values[item_prop]
            sku_value = raw_input(u'请输入商品属性（如：可爱粉）：'.encode(print_charset)).decode(print_charset)
            for v in prop_values:
                if v.get('name') == sku_value:
                    code_list.append(v.get('code'))
                    break
            else:
                print u'没有该属性'
        else:
            print u'没有该类别'
        item_prop = raw_input(u'请输入商品类别名称（如：颜色分类，直接回车结束输入）：'.encode(print_charset)).decode(print_charset)

    sku_id = None
    price = None
    stock = None
    for x in list(permutations(code_list, len(code_list))):
        if ';' + ';'.join(map(str, x)) + ';' in sku_dict.keys():
            item_prop = ';' + ';'.join(map(str, x)) + ';'
            sku_id = sku_dict[item_prop]['sku_id']
            price = sku_dict[item_prop]['price']
            stock = sku_dict[item_prop]['stock']
            print u'%s\t%s' % (u'sku_key为：', item_prop)
            print u'%s\t%s' % (u'sku_id为：', sku_id)
            print u'%s\t%s' % (u'单价为：', price)
            print u'%s\t%s' % (u'库存为：', stock)
            break
    else:
        print u'没有该款式。'
    return {
        'item_id': item_id,
        'sku_id': sku_id,
        'price': price,
        'stock': stock,
        'ct': info['ct'],
        'nekot': info['nekot']
    }


def add_item_to_cart(item_info):
    """
    添加商品到购物车
    :param item_info:
    :return:
    """
    add_cart_url = 'https://cart.taobao.com/add_cart_item.htm?'
    cookie_str, host = get_cookie(add_cart_url)
    print u'cookie串：', cookie_str

    quantity = raw_input(u'请输入需要加到购物车的数量：'.encode(print_charset))
    if quantity.isdigit():
        quantity = int(quantity)
        if quantity > item_info['stock']:
            print u'超过最大库存', item_info['stock']
    else:
        print u'非法输入'

    params = {
        'item_id': item_info['item_id'],
        'outer_id': item_info['sku_id'],
        'outer_id_type': '2',
        'quantity': quantity,  # 数量
        'opp': item_info['price'],  # 单价
        'nekot': item_info['nekot'],  # 时间戳
        'ct': item_info['ct'],  #
        'deliveryCityCode': '',
        'frm': '',
        'buyer_from': '',
        'item_url_refer': '',
        'root_refer': '',
        'flushingPictureServiceId': '',
        'spm': '',
        'ybhpss': ''
    }
    request = urllib2.Request(add_cart_url + urllib.urlencode(params))
    request.add_header('Accept', '*/*')
    request.add_header('Accept-Encoding', 'gzip, deflate, br')
    request.add_header('Accept-Language', 'zh-CN,zh;q=0.8,en;q=0.6')
    request.add_header('Connection', 'keep - alive')
    request.add_header('Cookie', cookie_str)
    request.add_header('Host', host)
    request.add_header('Referer', 'https://item.taobao.com/item.htm')
    request.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36')
    response = urllib2.urlopen(request)
    headers = response.info()
    content_type = headers.get('Content-Type')
    if content_type:
        charset = re.findall(r"charset=([\w-]+);?", content_type)[0]
    else:
        charset = 'utf-8'
    http_code = response.getcode()
    if http_code == 200:
        print u'添加到购物车成功'
    if 'Content-Encoding' in headers and headers['Content-Encoding'] == 'gzip':
        gz = gzip.GzipFile(fileobj=StringIO.StringIO(response.read()))
        data = gz.read().decode(charset)
        gz.close()
    else:
        data = response.read().decode(charset)
    with open(u'.\cart.text', 'w+') as cart_file:
        cart_file.write(data.encode(print_charset))


if __name__ == "__main__":
    try:
        set_proxy()
        add_item_to_cart(get_item_info())
    finally:
        print u'█' * 25, u'end.', u'█' * 25

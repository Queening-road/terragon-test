#!/bin/bash

# 获取CPU核数的脚本
# Script to get CPU core count

echo "=== CPU核数信息 / CPU Core Count Information ==="

# 方法1: 使用nproc命令
if command -v nproc >/dev/null 2>&1; then
    cores=$(nproc)
    echo "CPU核数 (nproc): $cores"
fi

# 方法2: 从/proc/cpuinfo读取
if [ -f /proc/cpuinfo ]; then
    cores_proc=$(grep -c ^processor /proc/cpuinfo)
    echo "CPU核数 (from /proc/cpuinfo): $cores_proc"
fi

# 方法3: 使用lscpu命令
if command -v lscpu >/dev/null 2>&1; then
    cores_lscpu=$(lscpu | grep "^CPU(s):" | awk '{print $2}')
    echo "CPU核数 (lscpu): $cores_lscpu"
fi

# 输出最终结果
if command -v nproc >/dev/null 2>&1; then
    final_count=$(nproc)
    echo ""
    echo "当前机器有 $final_count 个CPU核"
else
    echo ""
    echo "无法确定准确的CPU核数"
fi
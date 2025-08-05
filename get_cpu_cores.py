#!/usr/bin/env python3
import os
import multiprocessing

def get_cpu_core_count():
    """
    获取机器的CPU核数
    Returns the number of CPU cores on the machine
    """
    try:
        # 方法1: 使用multiprocessing.cpu_count()
        cpu_count = multiprocessing.cpu_count()
        print(f"CPU核数 (CPU Core Count): {cpu_count}")
        
        # 方法2: 使用os.cpu_count() (Python 3.4+)
        os_cpu_count = os.cpu_count()
        if os_cpu_count:
            print(f"CPU核数 (via os.cpu_count): {os_cpu_count}")
        
        return cpu_count
        
    except Exception as e:
        print(f"获取CPU核数时出错: {e}")
        return None

if __name__ == "__main__":
    core_count = get_cpu_core_count()
    if core_count:
        print(f"\n当前机器有 {core_count} 个CPU核")
    else:
        print("无法获取CPU核数")
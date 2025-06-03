import os
from pathlib import Path

def generate_directory_tree(root_dir, output_file=None, max_depth=None, exclude_dirs=None, exclude_files=None):
    """
    生成指定目录的树形结构并输出到文件或控制台
    
    参数:
        root_dir (str): 根目录路径
        output_file (str, optional): 输出文件路径，默认为None(输出到控制台)
        max_depth (int, optional): 最大递归深度，默认为None(不限制)
        exclude_dirs (list, optional): 要排除的目录名称列表，默认为None
        exclude_files (list, optional): 要排除的文件名称列表，默认为None
    """
    if exclude_dirs is None:
        exclude_dirs = []
    if exclude_files is None:
        exclude_files = []
    
    tree = []
    root_path = Path(root_dir)
    root_name = os.path.basename(root_dir)
    
    # 添加根目录
    tree.append(f"{root_name}/")
    
    def _generate_tree(path, prefix="", depth=0):
        # 检查是否达到最大深度
        if max_depth is not None and depth >= max_depth:
            return
        
        items = list(path.iterdir())
        # 按文件夹优先排序
        items.sort(key=lambda x: (not x.is_dir(), x.name))
        
        for i, item in enumerate(items):
            # 排除指定的目录和文件
            if item.is_dir() and item.name in exclude_dirs:
                continue
            if item.is_file() and item.name in exclude_files:
                continue
            
            # 确定连接符
            if i == len(items) - 1:
                connector = "└── "
                next_prefix = prefix + "    "
            else:
                connector = "├── "
                next_prefix = prefix + "│   "
            
            # 添加当前项
            if item.is_dir():
                tree.append(f"{prefix}{connector}{item.name}/")
                _generate_tree(item, next_prefix, depth + 1)
            else:
                tree.append(f"{prefix}{connector}{item.name}")
    
    _generate_tree(root_path, depth=0)
    
    # 输出结果
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(tree))
        print(f"目录树已保存到: {output_file}")
    else:
        print('\n'.join(tree))

if __name__ == "__main__":
    # 使用示例
    root_directory = r"C:\Users\Administrator\Desktop\shop\admin-backend"  # Windows路径示例
    output_path = r"C:\Users\Administrator\Desktop\shop\admin-backend\directory_tree.txt"    # 输出文件路径
    
    # 排除常见的临时文件和目录
    exclude_directories = ['.git', 'node_modules', '__pycache__']
    exclude_files = ['.DS_Store', 'Thumbs.db']
    
    generate_directory_tree(
        root_dir=root_directory,
        output_file=output_path,
        exclude_dirs=exclude_directories,
        exclude_files=exclude_files
    )    
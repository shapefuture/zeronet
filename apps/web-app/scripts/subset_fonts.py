import os
import subprocess

def subset_fonts(font_src_dir='public/fonts_src', font_out_dir='public/fonts'):
    for file in os.listdir(font_src_dir):
        if file.endswith('.ttf'):
            inpath = os.path.join(font_src_dir, file)
            outpath = os.path.join(font_out_dir, os.path.splitext(file)[0] + '.woff2')
            subprocess.run([
                'glyphhanger',
                '--subset', inpath,
                '--formats', 'woff2',
                '--LATIN',
                '--string', 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                '--output', outpath
            ], check=True)

if __name__ == "__main__":
    subset_fonts()
#!/usr/bin/env python3
"""
Script para verificar automaticamente se todas as imagens das câmeras estão carregando corretamente.
Testa cada URL e fornece um relatório detalhado.
"""

import requests
import json
import sys
from typing import Dict, List, Tuple
from urllib.parse import urlparse
import time

# Cores para output no terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def load_cameras_data() -> List[Dict]:
    """Carrega os dados das câmeras do arquivo cameras.ts"""
    try:
        # Ler o arquivo TypeScript
        with open('/home/ubuntu/vista/lib/cameras.ts', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extrair as URLs de thumbnail
        cameras = []
        lines = content.split('\n')
        
        current_camera = {}
        for i, line in enumerate(lines):
            if 'id: "' in line and 'name: "' not in line:
                current_camera = {'id': line.split('"')[1]}
            elif 'name: "' in line:
                current_camera['name'] = line.split('"')[1]
            elif 'thumbnail: "' in line:
                current_camera['thumbnail'] = line.split('"')[1]
                cameras.append(current_camera)
                current_camera = {}
        
        return cameras
    except Exception as e:
        print(f"{Colors.RED}Erro ao carregar dados das câmeras: {e}{Colors.RESET}")
        return []

def test_url(url: str, timeout: int = 10) -> Tuple[bool, int, str]:
    """
    Testa uma URL e retorna (sucesso, status_code, mensagem)
    """
    try:
        # Fazer requisição HEAD primeiro (mais rápido)
        response = requests.head(url, timeout=timeout, allow_redirects=True)
        
        if response.status_code == 200:
            # Verificar se é realmente uma imagem
            content_type = response.headers.get('content-type', '')
            if 'image' in content_type.lower():
                return True, response.status_code, "OK - Imagem válida"
            else:
                # Se HEAD não retorna content-type, tentar GET
                response = requests.get(url, timeout=timeout, stream=True)
                if response.status_code == 200:
                    return True, response.status_code, "OK - Imagem válida (GET)"
                else:
                    return False, response.status_code, f"Erro: Content-Type inválido ({content_type})"
        else:
            return False, response.status_code, f"Erro HTTP {response.status_code}"
    
    except requests.exceptions.Timeout:
        return False, 0, "Timeout - URL muito lenta"
    except requests.exceptions.ConnectionError:
        return False, 0, "Erro de conexão"
    except Exception as e:
        return False, 0, f"Erro: {str(e)}"

def verify_all_images() -> Dict:
    """Verifica todas as imagens e retorna um relatório"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}🔍 VERIFICADOR DE IMAGENS - VISTA PWA{Colors.RESET}\n")
    print(f"Carregando dados das câmeras...")
    
    cameras = load_cameras_data()
    if not cameras:
        print(f"{Colors.RED}Nenhuma câmera encontrada!{Colors.RESET}")
        return {}
    
    print(f"Encontradas {len(cameras)} câmeras\n")
    print(f"{Colors.BOLD}Testando URLs das imagens...{Colors.RESET}\n")
    
    results = {
        'total': len(cameras),
        'working': 0,
        'broken': 0,
        'cameras': []
    }
    
    for i, camera in enumerate(cameras, 1):
        camera_id = camera.get('id', 'unknown')
        camera_name = camera.get('name', 'Unknown')
        thumbnail_url = camera.get('thumbnail', '')
        
        print(f"[{i}/{len(cameras)}] {camera_name}...", end=' ', flush=True)
        
        if not thumbnail_url:
            print(f"{Colors.RED}❌ URL vazia{Colors.RESET}")
            results['broken'] += 1
            results['cameras'].append({
                'id': camera_id,
                'name': camera_name,
                'url': 'N/A',
                'status': 'ERRO',
                'message': 'URL vazia',
                'status_code': 0
            })
            continue
        
        success, status_code, message = test_url(thumbnail_url)
        
        if success:
            print(f"{Colors.GREEN}✅ OK{Colors.RESET}")
            results['working'] += 1
            results['cameras'].append({
                'id': camera_id,
                'name': camera_name,
                'url': thumbnail_url,
                'status': 'OK',
                'message': message,
                'status_code': status_code
            })
        else:
            print(f"{Colors.RED}❌ ERRO ({status_code}){Colors.RESET}")
            results['broken'] += 1
            results['cameras'].append({
                'id': camera_id,
                'name': camera_name,
                'url': thumbnail_url,
                'status': 'ERRO',
                'message': message,
                'status_code': status_code
            })
        
        time.sleep(0.5)  # Pequeno delay entre requisições
    
    return results

def print_report(results: Dict):
    """Imprime um relatório formatado dos resultados"""
    print(f"\n{Colors.BOLD}{'='*80}{Colors.RESET}")
    print(f"{Colors.BOLD}RELATÓRIO FINAL{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*80}{Colors.RESET}\n")
    
    total = results.get('total', 0)
    working = results.get('working', 0)
    broken = results.get('broken', 0)
    
    # Resumo
    print(f"Total de câmeras: {total}")
    print(f"{Colors.GREEN}✅ Funcionando: {working}{Colors.RESET}")
    print(f"{Colors.RED}❌ Com erro: {broken}{Colors.RESET}")
    
    if total > 0:
        percentage = (working / total) * 100
        if percentage == 100:
            print(f"{Colors.GREEN}Taxa de sucesso: {percentage:.1f}% 🎉{Colors.RESET}")
        else:
            print(f"{Colors.YELLOW}Taxa de sucesso: {percentage:.1f}%{Colors.RESET}")
    
    print(f"\n{Colors.BOLD}DETALHES POR CÂMERA:{Colors.RESET}\n")
    
    for camera in results.get('cameras', []):
        status_symbol = "✅" if camera['status'] == 'OK' else "❌"
        status_color = Colors.GREEN if camera['status'] == 'OK' else Colors.RED
        
        print(f"{status_symbol} {camera['name']} ({camera['id']})")
        print(f"   Status: {status_color}{camera['status']}{Colors.RESET}")
        print(f"   Mensagem: {camera['message']}")
        print(f"   URL: {camera['url'][:70]}..." if len(camera['url']) > 70 else f"   URL: {camera['url']}")
        print()
    
    # Recomendações
    if broken > 0:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠️  RECOMENDAÇÕES:{Colors.RESET}")
        print("As seguintes câmeras têm problemas com suas imagens:")
        for camera in results.get('cameras', []):
            if camera['status'] != 'OK':
                print(f"  - {camera['name']}: {camera['message']}")
        print("\nPrecisa atualizar as URLs dessas câmeras para fontes confiáveis.")
    else:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✨ TODAS AS IMAGENS ESTÃO FUNCIONANDO PERFEITAMENTE!{Colors.RESET}")
    
    print(f"\n{Colors.BOLD}{'='*80}{Colors.RESET}\n")

def save_report(results: Dict, filename: str = '/home/ubuntu/vista/image_verification_report.json'):
    """Salva o relatório em JSON para referência"""
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        print(f"Relatório salvo em: {filename}")
    except Exception as e:
        print(f"Erro ao salvar relatório: {e}")

if __name__ == '__main__':
    results = verify_all_images()
    print_report(results)
    save_report(results)
    
    # Retornar código de saída apropriado
    sys.exit(0 if results.get('broken', 0) == 0 else 1)

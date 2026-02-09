import re
import json

# Przeczytaj zawartość pliku
with open('fizyka2_drillv4.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Podziel na bloki pytań (separator to dwie nowe linie)
blocks = content.strip().split('\n\n')

questions = []
question_id = 1

for block in blocks:
    if not block.strip():
        continue
    
    lines = block.strip().split('\n')
    
    # Pomiń bloki które nie mają wystarczająco linii
    if len(lines) < 4:
        continue
    
    # Pierwsze linie to pytanie (mogą być wieloliniowe)
    # Szukamy linii zaczynających się na A), B), C), D)
    question_lines = []
    options_start_idx = 0
    
    for i, line in enumerate(lines):
        if line.strip().startswith('A)'):
            options_start_idx = i
            break
        else:
            question_lines.append(line)
    
    # Połącz pytanie w jedną linię, usuń nawiasy z numerami stron (str. X)
    question_text = ' '.join(question_lines)
    question_text = re.sub(r'\s*\(str\.\s*\d+\)', '', question_text).strip()
    question_text = re.sub(r'\s+', ' ', question_text)
    
    # Wyekstrahuj opcje
    options = []
    correct_answer_idx = -1
    
    for i in range(options_start_idx, min(options_start_idx + 4, len(lines))):
        line = lines[i].strip()
        
        # Sprawdź czy opcja ma prawidłową odpowiedź (>>>)
        has_correct_marker = line.startswith('>>>')
        if has_correct_marker:
            correct_answer_idx = len(options)
            line = line.replace('>>>', '').strip()
        
        # Usuń prefiks A), B), C), D) z opcji
        match = re.match(r'^[A-D]\)\s*(.*)$', line)
        if match:
            option_text = match.group(1).strip()
            options.append(option_text)
    
    # Dodaj pytanie tylko jeśli ma wszystkie 4 opcje
    if len(options) == 4 and correct_answer_idx >= 0:
        questions.append({
            'id': question_id,
            'question': question_text,
            'options': options,
            'correctAnswer': correct_answer_idx
        })
        question_id += 1

# Zapisz JSON do pliku
json_output = json.dumps(questions, ensure_ascii=False, indent=2)
with open('questions.json', 'w', encoding='utf-8') as f:
    f.write(json_output)
print(f"Łącznie pytań: {len(questions)}")
print("Pytania zapisane do pliku questions.json")

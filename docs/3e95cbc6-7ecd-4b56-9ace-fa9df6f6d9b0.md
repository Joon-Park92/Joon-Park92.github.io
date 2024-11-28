## TL;DR

- Awk는 텍스트 데이터를 다루는 강력한 도구임. 특정 조건에 맞는 데이터를 추출하거나, 가공, 계산, 출력 작업을 단순한 명령어로 처리할 수 있음.
- 데이터를 다룰 때 Awk의 예제 몇 가지만 익혀도 즉시 활용 가능함.

## 파일 내용 출력

**파일 전체 내용을 출력하려면 아래 명령어를 사용하면 됨.**

- 아래 명령어는 동일한 결과를 출력함.

  ```bash
  awk '{ print }' file.txt
  awk '{ print $0 }' file.txt
  ```

## 특정 필드 출력

**파일에서 특정 열(필드)만 추출하려면 아래 명령어를 사용하면 됨.**

- 첫 번째 열 출력:

  ```bash
  awk '{ print $1 }' file.txt
  ```

- 첫 번째와 두 번째 열 출력:

  ```bash
  awk '{ print $1, $2 }' file.txt
  ```

## 조건에 맞는 데이터 추출

**특정 조건을 만족하는 데이터만 추출하려면 아래 예제를 참고하면 됨.**

- awk '조건 { 동작 }' file.txt

- 첫 번째 필드가 2인 레코드에서 두 번째 필드 출력:

  ```bash
  awk '$1 == 2 { print $2 }' file.txt
  ```

- 세 번째 필드 값이 50보다 큰 레코드 출력:

  ```bash
  awk '$3 > 50 { print $0 }' file.txt
  ```

- "pp"를 포함한 레코드 출력:

  ```bash
  awk '/pp/' file.txt
  ```

## 패턴 매칭과 if문의 차이

**awk에서는 두 가지 방식으로 조건을 처리할 수 있음.**

### 1. 패턴 매칭 방식과 if문 비교

```bash
# 패턴 매칭 방식
awk '$3 > 50 { print $0 }' file.txt

# if문 방식
awk '{ if ($3 > 50) print $0 }' file.txt
```

### 2. 주요 차이점

- **실행 시점**
    - 패턴 매칭: 레코드를 읽기 전에 조건을 먼저 평가
    - if문: 레코드를 읽은 후 action 블록 안에서 조건을 평가

- **성능**
    - 패턴 매칭: 조건이 거짓이면 action 블록을 실행하지 않아 더 효율적
    - if문: action 블록은 항상 실행되므로 상대적으로 덜 효율적

### 3. 사용 예시

```bash
# 패턴 매칭 - 더 간결하고 효율적
awk '$1 == "kim" { print $2 }' file.txt

# if문 - 더 명시적이지만 덜 효율적
awk '{ if ($1 == "kim") print $2 }' file.txt

# 복잡한 조건의 경우 if문이 더 가독성이 좋음
awk '{
    if ($3 > 50 && $4 < 100) {
        print $0
    } else if ($3 <= 50) {
        print "Low score:", $0
    }
}' file.txt
```

## 데이터 연산

**필드 값에 연산을 적용하려면 아래와 같이 사용하면 됨.**

- 세 번째 필드 값에 10을 더해 출력:

  ```bash
  awk '{ print $1, $2, $3 + 10 }' file.txt
  ```

- 레코드의 모든 숫자 필드 합 계산:

  ```bash
  awk '{ sum=0; for (i=3; i<=NF; i++) sum += $i; print $0, sum }' file.txt
  ```

---

## 데이터 필터링 및 정렬

**필드 길이나 값을 기준으로 데이터를 필터링하거나 정렬 가능함.**

- 두 번째 필드 길이가 4 이상인 레코드 출력:

  ```bash
  awk 'length($2) >= 4 { print $0 }' file.txt
  ```

- 출력 결과를 역순으로 정렬:

  ```bash
  awk '{ print $0 }' file.txt | sort -r
  ```

---

## BEGIN과 END 활용

**처리 시작 전 초기화 작업이나 처리 후 마무리 작업이 필요하다면 사용 가능함.**

- 모든 레코드 처리 후 총합 계산:

  ```bash
  awk '{ sum += $3 } END { print "Total:", sum }' file.txt
  ```

- 입력 데이터 처리 전에 헤더 추가:

  ```bash
  awk 'BEGIN { print "No Name Score" } { print $1, $2, $3 }' file.txt
  ```

---

## Awk 한 줄로 끝내기

**필드 구분자가 쉼표(,)인 CSV 파일 처리 예제.**

- 첫 번째 필드 출력:

  ```bash
  awk -F ',' '{ print $1 }' file.csv
  ```

- 세 번째 필드의 최대값 찾기:

  ```bash
  awk -F ',' '{ if ($3 > max) max = $3 } END { print "Max:", max }' file.csv
  ```

## Example

```plaintext
Sample Input

A 25 27 50
B 35 37 75
C 75 78 80
D 99 88 76

Sample Output

A 25 27 50 : FAIL
B 35 37 75 : FAIL
C 75 78 80 : B
D 99 88 76 : A
```

```bash
awk '{
    total = $2 + $3 + $4
    avg = total / 3
    if (avg >= 70) grade = "A"
    else if (avg >= 60) grade = "B"
    else if (avg >= 50) grade = "C"
    else grade = "FAIL"
    print $1, $2, $3, $4, ":", grade
}' file.txt
```

---

## 마무리

위 예제를 참고하면 Awk로 데이터를 간단히 처리할 수 있음. 필요할 때 명령어를 조금만 응용하면 복잡한 데이터 작업도 빠르게 해결 가능함.

---
date: 2024-08-07
publish: true
reference_url:
- https://www.fivetran.com/blog/what-is-idempotence
summary: Idempotence는 반복 실행 시 결과가 변하지 않는 특성을 말함. 데이터 통합에서 이는 중복 기록을 방지하고, 데이터 파이프라인을
  오류에서 안전하게 함.
title: idempotent-basic
uuid: 8feb5ca2-1b5d-4e9b-aa95-c3cc19b3fada
---

## TL;DR

- Idempotence is the property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application
- Idempotence는 반복 실행 시 결과가 변하지 않는 특성을 말함. 데이터 통합에서 이는 중복 기록을 방지하고, 데이터 파이프라인을 오류에서 안전하게 함.
- Idempotent한 데이터 파이프라인을 만드는 방법은 `delete-write` 패턴을 사용하는 것임.
- Idempotent 가 보장된 파이프라인은 백필링, 실패한 실행 또는 기타 오류로 인해 데이터 파이프라인을 다시 실행해야할 때, 많은 문제가 사라짐.

## Idempotence 의미

- Idempotence는 수학적 함수에서 f(f(x)) = f(x) 같은 특성을 가짐.
- 데이터 통합에서 Idempotence는 동일한 데이터를 여러 번 처리해도 결과가 변하지 않음을 의미함.

## Example

다음과 같은 테이블에 기록된 데이터 웨어하우스가 있다고 가정해보자:

| id | 이름     | 역할     |
|----|----------|----------|
| 1  | RM       | 리더     |
| 2  | 진       | 보컬     |

데이터 소스가 다음과 같은 기록을 추가하고 이를 데이터 웨어하우스와 동기화하려고 할 때:

| id | 이름   | 역할     |
|----|--------|----------|
| 3  | 슈가   | 래퍼     |

원하는 출력 결과는 다음과 같다:

| id | 이름   | 역할     |
|----|--------|----------|
| 1  | RM     | 리더     |
| 2  | 진     | 보컬     |
| 3  | 슈가   | 래퍼     |

구체적으로, 우리는 id 3의 기록을 추가하고자 한다.

- 기존 기록: id 1, 2
- 추가 기록: id 3
- 실패한 동기화 후 다시 시도할 때 idempotent하면 중복 기록이 발생하지 않음.

Idempotent하지 않은 경우:

| id | 이름   | 역할     |
|----|--------|----------|
| 1  | RM     | 리더     |
| 2  | 진     | 보컬     |
| 3  | 슈가   | 래퍼     |
| 3  | 슈가   | 래퍼     |

## Idempotence가 없는 경우 발생 문제

- 데이터 파이프라인이 동일한 작업을 반복할 때, 중복된 데이터가 기록됨.
- 중복 기록 발생으로 인해 잘못된 통계 및 분석 결과 도출.
- 데이터 처리 및 저장 공간 낭비.
- 비즈니스 의사 결정에 영향을 미칠 수 있음.

## 데이터 파이프라인을 Idempotent하게 만드는 방법

- 데이터 파이프라인을 Idempotent하게 만드는 일반적인 방법은 `delete-write` 패턴을 사용하는 것임.
- 이름에서 알 수 있듯이, 파이프라인은 새 데이터를 쓰기 전에 기존 데이터를 삭제함.
- 이 방법은 데이터 파이프라인이 다시 생성할 데이터를 신중하게 삭제하는 것임

    ```python
    import os
    import shutil
    import pandas as pd

    def process_data(input_file: str, output_dir: str, execution_date: str) -> None:
        output_path = os.path.join(output_dir, execution_date)
        if os.path.exists(output_path):
            shutil.rmtree(output_path) # removes entire folder

        df = pd.read_csv(input_file)
        # Add your transformations here
        df.to_parquet(os.path.join(output_path, "data.parquet"), partition_cols=["Date"])
    ```

- 여러 작업(다른 날짜)을 동시에 실행할 때 테이블 이름 충돌을 방지하기 위해 run-specific 임시 테이블 TEMP_YYYY_MM_DD를 사용하는 것에 유의.

    ```sql
    CREATE TEMP TABLE TEMP_YYYY_MM_DD AS
    SELECT c1, c2, SOME_TRANSFORMATION_FUNCTION(c3) as c3
    FROM stage_table
    WHERE day = 'yyyy-mm-dd';

    -- note the delete-write pattern
    DELETE FROM final_table WHERE day = 'yyyy-mm-dd';

    INSERT INTO final_table(c1, c2, c3)
    SELECT c1, c2, c3
    FROM TEMP_YYYY_MM_DD;

    DROP TEMP TABLE TEMP_YYYY_MM_DD;
    ```

    or

    ```sql
    WITH TEMP_YYYY_MM_DD AS (
        SELECT c1, c2, SOME_TRANSFORMATION_FUNCTION(c3) as c3
        FROM stage_table
        WHERE day = 'yyyy-mm-dd'
    )
    -- note the delete-write pattern
    DELETE FROM final_table WHERE day = 'yyyy-mm-dd';

    INSERT INTO final_table(c1, c2, c3)
    SELECT c1, c2, c3
    FROM TEMP_YYYY_MM_DD;
    ```

- 대부분의 라이브러리와 프레임워크는 덮어쓰기 옵션을 제공함(e.g. Spark overwrite, Snowflake overwrite) 이는 삭제 후 쓰기보다 안전함.
    - 데이터 무결성 문제가 발생하거나
    - 데이터 손실이 발생할 수 있음
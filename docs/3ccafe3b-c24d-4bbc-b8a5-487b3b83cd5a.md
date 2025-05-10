---
publish: true
uuid: 3ccafe3b-c24d-4bbc-b8a5-487b3b83cd5a
---

# Gradient Boosting

## TL; DR

- 그라디언트 부스팅은 여러 약한 학습기를 순차적으로 학습시켜 강력한 모델을 만드는 앙상블 방법입니다.
- 각 단계에서 현재 모델의 예측 오류를 줄이는 방향으로 새로운 학습기를 추가합니다.
- 높은 예측 성능을 제공하며, 다양한 문제에 적용할 수 있습니다.
- 학습률과 트리 복잡도를 조절하여 모델을 최적화하고 과적합을 방지할 수 있습니다.

## 기본 개념

- 그라디언트 부스팅은 데이터 과학과 머신러닝에서 강력한 도구로 널리 사용되며, 특히 예측 성능이 중요한 문제에서 자주 사용됩니다.

- Gradient Boosting 은 여러 약한 학습기를 결합하여 강력한 예측 모델을 만드는 앙상블 학습 방법입니다. 그라디언트 부스팅은 각 단계에서 모델의 오류를 줄이는 방향으로 새로운 학습기를 추가하여 점진적으로 모델 성능을 향상시킵니다. 이 방법은 주로 결정 트리(Decision Tree)를 약한 학습기로 사용합니다.

1. **약한 학습기**:
    - 약한 학습기는 단독으로는 성능이 낮은 모델을 의미합니다. 결정 트리의 경우, 보통 깊이가 매우 작은 트리를 사용합니다.
2. **순차적 학습**:
    - 그라디언트 부스팅은 순차적으로 약한 학습기를 학습시킵니다.
    - 각 단계에서 현재 모델의 예측 오류(잔차)를 줄이는 방향으로 새로운 학습기를 추가합니다.
3. **오류 보정**:
    - 현재 모델의 예측값과 실제 값의 차이인 잔차를 계산합니다.
    - 새로운 학습기는 이 잔차를 예측하도록 학습됩니다.
4. **가중치 조정**:
    - 각 학습기의 예측값에 가중치를 부여하여, 전체 모델의 예측값을 조정합니다.
    - 학습률(learning rate)은 각 학습기의 기여도를 조정하여, 모델이 과적합되지 않도록 합니다.

### 그라디언트 부스팅 알고리즘 단계

1. **모델 초기화**:

    - 초기 모델 $F_0$ 는 타겟 변수의 초기값(예: 평균값)으로 설정합니다.

2. **반복 학습**:

    - 각 반복 $m = 1, 2, \ldots, M$ 단계에서 다음을 수행합니다:
        - 현재 모델의 예측값 $F_{m-1}(x)$를 사용하여 잔차(residual) $r_i^{(m)}$를 계산합니다.
        - 새로운 학습기 $h_m(x)$를 잔차 $r_i^{(m)}$를 예측하도록 학습합니다.
        - 학습률 $\eta$를 적용하여 현재 모델을 업데이트합니다:
          $$F_m(x) = F_{m-1}(x) + \eta h_m(x)$$

3. **최종 모델**:
    - 모든 반복이 완료되면, 최종 모델 $F_M(x)$를 사용하여 예측을 수행합니다.

### 의사 코드 (Pseudo Code)

```text
initialize F_0(x) = mean(y)

for m = 1 to M do:
    r_i = y_i - F_{m-1}(x_i)  # calculate residuals

    train a weak learner h_m(x) to predict r_i

    F_m(x) = F_{m-1}(x) + η * h_m(x)  # update the model

return F_M(x)
```

### 장점과 단점

#### 장점

1. **높은 예측 성능**: 다양한 문제에서 높은 예측 성능을 발휘합니다.
2. **유연성**: 회귀, 분류, 순위 예측 등 다양한 문제에 적용할 수 있습니다.
3. **과적합 제어**: 학습률과 트리 복잡도를 조절하여 과적합을 방지할 수 있습니다.

#### 단점

1. **훈련 시간**: 모델 학습 시간이 길 수 있으며, 특히 대규모 데이터셋에서 그렇습니다.
2. **해석성**: 개별 학습기는 해석이 가능하지만, 전체 앙상블 모델은 해석이 어렵습니다.
3. **병렬화 어려움**: 순차적 학습 방식으로 인해 병렬화가 어렵습니다.

### 간단한 Python 구현 예제

아래는 Python으로 그라디언트 부스팅 회귀 모델을 구현한 예제입니다.

```python
import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.datasets import load_boston
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

class SimpleGradientBoostingRegressor:
    def __init__(self, n_estimators=100, learning_rate=0.1, max_depth=3):
        self.n_estimators = n_estimators
        self.learning_rate = learning_rate
        self.max_depth = max_depth
        self.trees = []

    def fit(self, X, y):
        # 초기 모델 예측값 설정 (타겟 값의 평균)
        self.initial_prediction = np.mean(y)
        y_pred = np.full(y.shape, self.initial_prediction)

        for _ in range(self.n_estimators):
            # 잔차 계산
            residuals = y - y_pred

            # 잔차를 예측하도록 약한 학습기 학습
            tree = DecisionTreeRegressor(max_depth=self.max_depth)
            tree.fit(X, residuals)

            # 예측값 업데이트
            y_pred += self.learning_rate * tree.predict(X)

            # 학습된 트리 저장
            self.trees.append(tree)

    def predict(self, X):
        y_pred = np.full((X.shape[0],), self.initial_prediction)
        for tree in self.trees:
            y_pred += self.learning_rate * tree.predict(X)
        return y_pred

# 데이터 로드 및 전처리
boston = load_boston()
X, y = boston.data, boston.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 모델 학습 및 평가
model = SimpleGradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse:.4f}")
```
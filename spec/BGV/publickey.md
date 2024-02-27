## Generating Public Key

This section explains how this scheme generates public key $PK$.

#### Preliminaries

- $t \in \mathbb{Z}$: plaintext modulus
- $q_l \in \mathbb{Z}$: ciphertext modulus at level $l$
- $R_q$: uniform random distribution over $R_q = \mathbb{Z}_q [x] / (x^n + 1)$.
- $\chi$: error distribution defined as a discrete Gaussian distribution with parameters $\mu$ and $\sigma$ over $R$ bounded by some integer $\beta$.
- $[\cdot]_{q_l}$: polynomial arithmetic should be done modulo $q_l$

#### Key Generation

The public key $PK$ is a pair of polynomials $(PK_1, PK_2)$ calculated as follows:

$$
PK_1 = [-1(a \cdot SK + t \cdot e)]_{q_l} \\
PK_2 = a
$$

where $a$ is a random polynomial in $R_q$, $e$ is a random error polynomial sampled from $\chi$.

Note taht as $PK_2$ is in $R_q$, polynomial arithmetic should also be performed modulo the ring polynomial modulus $(x^n + 1)$.

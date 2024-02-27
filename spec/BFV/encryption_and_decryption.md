## Encryption and Decryption

This section explains how this scheme encrypt plaintext $M$ to ciphertext $C$.

#### Preliminaries

- $n \in \mathbb{Z}$: the ring dimension
- $t \in \mathbb{Z}$: plaintext coefficients
- $q \in \mathbb{Z}$: ciphertext coefficients
- $\mathcal{P}$: $= R_t = \mathbb{Z}_t [x]/(x^n + 1)$
- $\mathcal{C}$: $= R_q \times R_q$, where $R_q = \mathbb{Z}_q [x] / (x^n + 1)$

#### Encryption

To encrypt a plaintext message $M$ in $\mathcal{P}$, one first generates small random polynomials $u$ from $R_2$ and $e_1, e_2$ from $\chi$ and returns the ciphertext $C = (C_1, C_2)$ in $\mathcal{C}$ as follows:

$$
C_1 = [PK_1 \cdot u + e_1 + \bigtriangleup M]_q \\
C_2 = [PK_2 \cdot u + e_2]_q
$$

The parameter $\bigtriangleup$ is defined as the quotient of dividing $q$ by $t$, i.e., $\bigtriangleup = \frac{q}{t}$.

#### Decryption

Decryption is performed by evaluating the ciphertext on the secret key as follows and inverting the scaling factor applied in encryption:

$$
M = \Bigl\lbrack \Bigl\lfloor \frac{t[C_1 + C_2 \cdot SK]_q}{q} \Bigr\rceil \Bigr\rbrack _t
$$
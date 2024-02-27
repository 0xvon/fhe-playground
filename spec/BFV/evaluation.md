## Homomorphic Evaluation

This section explains how this scheme's homomorphic evaluation procedures work.

#### Preliminaries

- $n \in \mathbb{Z}$: the ring dimension
- $t \in \mathbb{Z}$: plaintext coefficients
- $q \in \mathbb{Z}$: ciphertext coefficients
- $\mathcal{P}$: $= R_t = \mathbb{Z}_t [x]/(x^n + 1)$
- $\mathcal{C}$: $= R_q \times R_q$, where $R_q = \mathbb{Z}_q [x] / (x^n + 1)$

#### Addition

This procedure is quite simple, we just add the corresponding polynomials in each ciphertext as shown below:

$$
EvalAdd(C^{(1)}, C^{(2)}) = ([C^{(1)}_1 + C^{(2)}_1]_q, [C^{(1)}_2 + C^{(2)}_2]_q) = C^{(3)}
$$

#### Multiplication

It's useful to write ciphertext as an evaluation at $SK$ similar to what we did in the derivation of decryption:

$$
C^{(1)}(SK) = \bigtriangleup M^{(1)} + v_1 + q \cdot r_1 \\
C^{(2)}(SK) = \bigtriangleup M^{(2)} + v_2 + q \cdot r_2
$$

Multiplying the ciphertexts would give us:

$$
(C^{(1)} \cdot C^{(2)})(SK) = \bigtriangleup ^2 M^{(1)} \cdot M^{(2)} + \bigtriangleup (M^{(1)} \cdot v_2 + M^{(2)} \cdot v_1) + \\
q(v_1 \cdot r_2 + v_2 \cdot r_1) + q \cdot \bigtriangleup (M^{(1)} \cdot r_2 + M^{(2)} \cdot r_1) + v1 \cdot v2 + q^2 \cdot r_1 \cdot r_2 (13)
$$

The product ciphertext looks close to an encryption of what we want $\bigtriangleup \cdot [M^{(1)} \cdot M^{(2)}]_t$.

We notice that scaling by $\frac{1}{\bigtriangleup}$ gives us exactly what we want in the first term plus some noise. 

However, the last term $(q^2 \cdot r_1 \cdot r_2)$ would generate large noise since $q^2$ does not divide $\bigtriangleup$. Instead, we would scale by factor $\frac{t}{q}$.

Now, we can write $M^{(1)} \cdot M^{(2)} = [M^{(1)} \cdot M^{(2)}]_t + t \cdot r_M$.

We can also write $v_1 \cdot v_2 = [v_1 \cdot v_2]_{\bigtriangleup} + \bigtriangleup \cdot r_v$.

Scaling by $\frac{t}{q}$ and substituting these expressions in Equation (13), we obtain the following:

$$
\frac{t}{q}(C^{(1)} \cdot C^{(2)})(SK) = \bigtriangleup [M^{(1)} \cdot M^{(2)}]_t + (M^{(1)} \cdot v_2 + M^{(2)} \cdot v_1) + \\
t(v_1 \cdot r_2 + v_2 \cdot r_1) + r_v + (q - [q]_t) \cdot (r_M + M^{(1)} \cdot r_2 + M^{(2)} \cdot r_1) + \\
q \cdot t \cdot r_1 \cdot r_2 + \frac{t}{q} [v_1 \cdot v_2]_{\bigtriangleup} - \\
\frac{[q]_t}{q} (\bigtriangleup M^{(1)} \cdot M^{(2)} + M^{(1)} \cdot v_2 + M^{(2)} \cdot v_1 + r_v) (14)
$$

The final step in the derivation is reducing Equation (14) modulo $q$, which gives us:

$$
\frac{t}{q}(C^{(1)} \cdot C^{(2)})(SK) = \bigtriangleup [M^{(1)} \cdot M^{(2)}]_t + (M^{(1)} \cdot v_2 + M^{(2)} \cdot v_1) + \\
t(v_1 \cdot r_2 + v_2 \cdot r_1) + r_v - [q]_t (r_M + M^{(1)} \cdot r_2 + M^{(2)} \cdot r_1) + r_e (15)
$$

where $r_e$ is the rounding error generated from the last two terms in Equation (14).

The noise growth for multiplication grows by a linear factor that is approximately $2 \cdot t \cdot n^2 \cdot ||SK||$.

In short, to evaluate $EvalMut$, we compute the tensor product of the input ciphertexts and scale by $\frac{t}{q}$ as follows:

$$
EvalMult(C^{(1)}, C^{(2)}) = \Biggl(
    \left[\left\lfloor \frac{t(C^{(1)}_1 \cdot C^{(2)}_1)}{q} \right\rceil \right]_q ,  
    \left[\left\lfloor \frac{t(C^{(1)}_1 \cdot C^{(2)}_2 + C^{(1)}_2 \cdot C^{(2)}_1)}{q} \right\rceil \right]_q , \\
    \left[\left\lfloor \frac{t(C^{(1)}_2 \cdot C^{(2)}_2)}{q} \right\rceil \right]_q
\Biggr)
$$

It can be noticed that $EvalMut$ increases the number of terms in the resulting ciphertext from 2 to 3 ring elements. Moreover, in order to decrypt the resulting ciphertext, a slightly different decryption procedure has to be used. Fortunately, these complications can be resolved via Relinearization.

#### Relinearization

Given $C^* = \{ C^*_1 , C^*_2 , C^*_3 \}$, find $\hat{C}^* = \{ \hat{C}^*_1 , \hat{C}^*_2 \}$ s.t.:

$$
[C^*_1 + C^*_2 \cdot SK + C^*_3 \cdot SK^2]_q = [\hat{C}^*_1 + \hat{C}^*_2 \cdot SK + r]_q
$$

Using evaluation key $EK = (-(a \cdot SK + e) + SK^2 , a)$, computes $\hat{C}^*$ as follows:

$$
\hat{C}^*_1 = [{C}^*_1 + EK_1 \cdot {C}^*_3]_q \\
\hat{C}^*_2 = [{C}^*_2 + EK_2 \cdot {C}^*_3]_q \\
$$
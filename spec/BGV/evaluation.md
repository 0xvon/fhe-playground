## Homomorphic Evaluation

This section explains how this scheme's homomorphic evaluation procedures work.

#### Addition

This procedure is quite simple, we just add the corresponding polynomials in each ciphertext as shown below:

$$
EvalAdd(C^{(1)}, C^{(2)}) = ([C^{(1)}_1 + C^{(2)}_1]_{q_l}, [C^{(1)}_2 + C^{(2)}_2]_{q_l}) = C^{(3)}
$$

#### Multiplication

It's useful to write ciphertext as an evaluation at $SK$ similar to what we did in the derivation of decryption:

$$
C^{(1)}(SK) = M^{(1)} + t \cdot v_1 + q_l \cdot r_1 \\
C^{(2)}(SK) = M^{(2)} + t \cdot v_2 + q_l \cdot r_2
$$

Multiplying the ciphertexts would give us:

$$
(C^{(1)} \cdot C^{(2)})(SK) = 
M^{(1)} \cdot M^{(2)} + 
t(M^{(1)} \cdot v_2 + M^{(2)} \cdot v_1) + \\
q_l \cdot t (v_1 \cdot r_2 + v_2 \cdot r_1) + 
q_l (M^{(1)} \cdot r_2 + M^{(2)} \cdot r_1) + \\
t^2 \cdot v_1 \cdot v_2 + q_l^2 \cdot r_1 \cdot r_2 \\
= M^{(1)} \cdot M^{(2)} + t(M^{(1)} \cdot v_2 + M^{(2)} \cdot v_1 + t \cdot v_1 \cdot v_2)
$$

The decryption forumula of the product ciphertext has the structure of a valid ciphertext encrypting $M^{(1)} \cdot M^{(2)}$ with noise $v = M^{(1)} \cdot v_2 + M^{(2)} \cdot v_1 + t \cdot v_1 \cdot v_2$.

Note how the noise term grows multiplicatively as the product of the noise in the input ciphertexts (the term $t \cdot v_1 \cdot v_2$).

This means that as we go deeper in the computation, the noise grows exponentially. To resolve this problem, BGV uses $ModSwitch$ to reduce the rate at which multiplication noise grows.

From the above discussion, we can deduce that $EvalMut$ can be evaluated as polynomial multiplication of the input ciphertexts as can be shown in the following equation:

$$
EvalMult(C^{(1)}, C^{(2)}) = (
    [C^{(1)}_1 \cdot C^{(2)}_1]_{q_l},
    [C^{(1)}_1 \cdot C^{(2)}_2 + C^{(1)}_2 \cdot C^{(2)}_1]_{q_l}, \\
    [C^{(1)}_2 \cdot C^{(2)}_2]_{q_l},
)
$$

It can be noticed that $EvalMut$ increases the number of terms in the resulting ciphertext from 2 to 3 ring elements. Moreover, in order to decrypt the resulting ciphertext, a slightly different decryption procedure has to be used. Fortunately, these complications can be resolved via Relinearization.

#### Relinearization

Given $C^* = \{ C^*_1 , C^*_2 , C^*_3 \}$, find $\hat{C}^* = \{ \hat{C}^*_1 , \hat{C}^*_2 \}$ s.t.:

$$
[C^*_1 + C^*_2 \cdot SK + C^*_3 \cdot SK^2]_{q_l} = [\hat{C}^*_1 + \hat{C}^*_2 \cdot SK + r]_{q_l}
$$

Using evaluation key $EK = (-(a \cdot SK + e) + SK^2 , a)$, computes $\hat{C}^*$ as follows:

$$
\hat{C}^*_1 = [{C}^*_1 + EK_1 \cdot {C}^*_3]_{q_l} \\
\hat{C}^*_2 = [{C}^*_2 + EK_2 \cdot {C}^*_3]_{q_l}
$$

#### ModSwitch

As mentioned previously, $ModSwitch$ is used to control the multiplication noise. It can be transformed into an equivalent ciphertext $C'$ defined with respect to another modulus $q'$ and the same secret key $SK$ s.t.:

$$
[C(SK)]_q = [C'(SK)]_{q'}
$$

This transformation is done by scaling the coefficients of $C$ by the quantity $q'/q$ and some suitable rounding. 

To reduce the noise magnitude, we choose a fairly smaller $q'$ than $q$, which allows us to scale down the multiplication noise.

Note that in the BGV context, $q$ can be at any level $l$, i.e., $q_l$; and $q'$ in this context is simple $q_{l-1}$.

Moreover, the ciphertext moludo $q_l$, $\forall ≤ l ≤ L$ are chosen such that they are equivalent modulo $t$. This result in scaling down the noise without affecting the encrypted plaintext message. It is as if we are scaling by 1 from the plaintext perspective.

$ModSwitch$ can be computed as shown below:

$$
C' = [\frac{q'}{q} \cdot C]
$$

where $[\cdot]$ is a suitable rounding function.

The transformed ciphertext $C'$ is defined with respect to the new modulus $q'$.
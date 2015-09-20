int fib(int n)
{
    if (n)
    {
        if (n - 1)
        {
            return fib(n - 2) + fib(n - 1);
        }
        else
        {
            return 1;
        }
    }
    else
    {
        return 0;
    }
}

int main()
{
    return fib(5);
}

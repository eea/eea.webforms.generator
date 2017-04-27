use HTML::FromANSI::Tiny;
my $h = HTML::FromANSI::Tiny->new(
  auto_reverse => 1, background => 'white', foreground => 'black',
);
 
# output from some command
my $output = `babel-node ./index.js`;#"\e[31mfoo\033[1;32mbar\033[0m";
 
# include the default styles if you don't want to define your own:
print $h->style_tag(); # or just $h->css() to insert into your own stylesheet
 
print $h->html($output);
# prints '<span class="red">foo</span><span class="bold green">bar</span>'